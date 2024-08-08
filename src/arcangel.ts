import { createGrid } from "./lib/createGrid.js";
import { getOpenAi } from "./lib/getOpenAi.js";
import { getImage } from "./lib/getImage.js";
import { createChatSystemMessage } from "./lib/createChatSystemMessage.js";
import { createChatImageMessage } from "./lib/createChatImageMessage.js";
import { getToolCalls } from "./lib/getToolCalls.js";
import { createChatToolResponseMessage } from "./lib/createChatToolResponseMessage.js";
import { createChatToolCallMessage } from "./lib/createChatToolCallMessage.js";
import { createChatAssistantMessage } from "./lib/createChatAssistantMessage.js";
import { isException } from "./lib/isException.js";
import { createException } from "./lib/createException.js";
import { v4 as uuidv4 } from "uuid";
import * as Session from "./types/Session.js";
import { ChatMessage } from "./types/ChatMessage.js";
import { getGetDimensionsTool } from "./tools/getGetDimensionsTool.js";
import { getSetColorRedTool } from "./tools/getSetColorRedTool.js";
import { writeImage } from "./lib/writeImage.js";
import { writeSession } from "./lib/writeSession.js";
import { getConfig } from "./lib/getConfig.js";

const openai = getOpenAi();

const getParameters = () => {
  return {
    model: "gpt-4o-mini",
    gridSize: 8,
  };
};

const getEnvironment = async (args: {
  memory: Session.Memory;
}): Promise<Session.Environment> => {
  return {
    id: uuidv4(),
    type: "environment",
    input: createGrid({
      height: getParameters().gridSize,
      width: getParameters().gridSize,
      color: "red",
    }),
    tools: [
      getGetDimensionsTool({
        workingGrid: args.memory.grid,
      }),
      getSetColorRedTool({
        workingGrid: args.memory.grid,
      }),
    ],
  };
};

const getInstructions = async (args: {
  environment: Session.Environment;
  memory: Session.Memory;
}): Promise<Session.Instructions> => {
  const workingGridImage = await getImage({ grid: args.memory.grid });
  const inputImage = await getImage({ grid: args.environment.input });
  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. Each session is initialized with a target grid and a blank working grid. Your goal is to run commands to transform the working grid into the target grid. Every time a command exits, the shell's daemon will provide feedback.`;

  return {
    id: uuidv4(),
    type: "instructions",
    messages: [
      createChatSystemMessage({
        content: systemPrompt,
      }),
      createChatImageMessage({
        text: "Ok, I've initialized the working grid. It's blank, here's an image of it.",
        dataUrl: workingGridImage.dataUrl,
      }),
      createChatImageMessage({
        text: "And here's an image of the target grid.",
        dataUrl: inputImage.dataUrl,
      }),
    ],
  };
};

const getOptions = (): Session.Config => {
  return {
    id: uuidv4(),
    type: "options",
    model: getParameters().model,
    maxSteps: 10,
    maxTime: 10 * 60 * 1000, // 10 minutes
    maxToolCalls: 100,
    maxMessages: 100,
    maxTokens: 1000000,
  };
};

const getMemory = (): Session.Memory => {
  return {
    id: uuidv4(),
    type: "memory",
    grid: createGrid({
      height: 8,
      width: 8,
      color: "black",
    }),
  };
};

const getMessages = (args: { session: Session.Session }): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  messages.push(...args.session.instructions.messages);
  for (const history of args.session.history) {
    messages.push(...history.messages);
  }
  return messages;
};

const getResponse = async (args: {
  session: Session.Session;
}): Promise<Session.Response> => {
  return openai.chat.completions.create({
    model: getParameters().model,
    messages: getMessages({ session: args.session }),
    tools: args.session.environment.tools.map((tool) => tool.spec),
  });
};

const getGeneration = async (args: {
  session: Session.Session;
  response: Session.Response;
}): Promise<Session.Generation | Session.Fault> => {
  const generation: Omit<Session.Generation, "code"> = {
    id: uuidv4(),
    type: "generation",
    time: Date.now(),
    messages: [],
  };

  const toolCalls = getToolCalls({ completion: args.response });

  if (toolCalls === undefined) {
    if (args.response.choices[0].message.content === null) {
      throw new Error(`Response is not a tool call or an assistant message.`);
    }

    generation.messages.push(
      createChatAssistantMessage({
        content: args.response.choices[0].message.content,
      }),
    );

    return {
      ...generation,
      code: "WITHOUT_TOOL_CALLS",
    };
  }

  generation.messages.push(
    createChatToolCallMessage({
      content: args.response.choices[0].message.content,
      toolCalls,
    }),
  );

  for (const toolCall of toolCalls) {
    const tool = args.session.environment.tools.find(
      (tool) => tool.spec.function.name === toolCall.function.name,
    );

    if (tool === undefined) {
      throw createException({
        code: "TOOL_CALL_INVALID_NAME",
        reason: `Tool call has invalid name: ${toolCall.function.name}`,
      });
    }

    const toolCallResult = tool.handler(toolCall.function.arguments);

    generation.messages.push(
      createChatToolResponseMessage({
        toolCallId: toolCall.id,
        name: toolCall.function.name,
        content: JSON.stringify(toolCallResult, null, 2),
      }),
    );
  }

  return {
    ...generation,
    code: "WITH_TOOL_CALLS",
  };
};

const getFeedback = async (args: {
  session: Session.Session;
  generation: Session.Generation | Session.Fault;
}): Promise<Session.Feedback | Session.Fault> => {
  const feedback: Omit<Session.Feedback, "code"> = {
    id: `${Date.now()}-${uuidv4()}`,
    type: "feedback",
    time: Date.now(),
    messages: [],
  };

  const image = await getImage({ grid: args.session.memory.grid });

  feedback.messages.push(
    createChatImageMessage({
      text: "Here's the most recent image of the working grid.",
      dataUrl: image.dataUrl,
    }),
  );

  return {
    ...feedback,
    code: "SHOW_WORKING_GRID",
  };
};

const main = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const memory = getMemory();
  const environment = await getEnvironment({ memory });
  const instructions = await getInstructions({ environment, memory });
  const options = getOptions();

  const session: Session.Session = {
    id: uuidv4(),
    environment,
    memory,
    instructions,
    config: options,
    history: [],
    exit: null,
  };

  const takeSnapshot = async (args: { opts?: { isFinal?: boolean } }) => {
    const inputImage = await getImage({ grid: session.environment.input });

    await writeImage({
      image: inputImage.image,
      path: `./data/${getConfig().EXPERIMENT_ID}/${session.id}/input.png`,
    });

    const workingGridImage = await getImage({ grid: session.memory.grid });

    await writeImage({
      image: workingGridImage.image,
      path: `./data/${getConfig().EXPERIMENT_ID}/${session.id}/${args?.opts?.isFinal ? "result" : session.history.length.toString()}.png`,
    });

    await writeSession({
      session,
      suffix: args?.opts?.isFinal
        ? "result"
        : session.history.length.toString(),
    });
  };

  while (session.history.length < session.config.maxSteps) {
    try {
      await takeSnapshot({});

      const response = await getResponse({ session });

      const generation = await getGeneration({ session, response });

      session.history.push(generation);

      // TODO WE SHOULD PROBABLY HAVE A handleGeneration STEP.

      const feedback = await getFeedback({ session, generation });

      session.history.push(feedback);

      // TODO WE SHOULD PROBABLY HAVE A handleFeedback STEP.
    } catch (err) {
      if (!isException(err)) {
        session.exit = {
          id: uuidv4(),
          time: Date.now(),
          ok: false,
          exception: createException({
            code: "UNKNOWN_EXCEPTION",
            reason: JSON.stringify(err, Object.getOwnPropertyNames(err)),
          }),
        };
      } else {
        session.exit = {
          id: uuidv4(),
          time: Date.now(),
          ok: false,
          exception: err,
        };
      }

      break;
    }
  }

  await takeSnapshot({ opts: { isFinal: true } });
};

for (let i = 0; i < 10; i++) {
  await main();
}
