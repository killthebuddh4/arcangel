import OpenAI from "openai";
import { getReferenceImage } from "./getReferenceImage.js";
import { getNumbersImage } from "./getNumbersImage.js";
import { parseNumbersEquality } from "./parseGridEquality.js";
import { getAssistantMessage } from "./getAssistantMessage.js";
import { getUserImageMessage } from "./getUserImageMessage.js";
import { getSystemMessage } from "./getSystemMessage.js";
import { parseToolCall } from "./parseToolCall.js";
import { getValidateEncodedTool } from "./getValidateEncodedTool.js";
import { parseValidateEncodedToolCall } from "./parseValidateEncodedToolCall.js";
import { writeStreamImage } from "./writeStreamImage.js";
import { getUserTextMessage } from "./getUserTextMessage.js";
import { parseNumbers } from "./parseNumbers.js";

const MODEL = "gpt-4o";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

type Feedback =
  | {
      type: "retry";
      reason: string;
    }
  | {
      type: "amend";
      numbers: number[][];
      reason: string;
    };

export const generateNumbers = async (args: {
  streamId: string;
  numbers: number[][];
}) => {
  await writeStreamImage({
    streamId: args.streamId,
    numbers: args.numbers,
  });

  const numbersImage = await getNumbersImage({ numbers: args.numbers });

  const referenceImage = await getReferenceImage();

  const exampleImage = await getNumbersImage({ numbers: EXAMPLE_NUMBERS });

  const feedback: Feedback[] = [];

  const messages = [
    getSystemMessage({
      text: "Please answer the user's queries. Please ignore the white section of the images. Please focus on the indexed grid sections.",
    }),
    getUserImageMessage({
      text: "This image represents an integer-to-color mapping. On the left is the integer that should be used to represent its corresponding color.",
      dataUrl: referenceImage.dataUrl,
    }),
    getAssistantMessage({
      text: "So the number on the left corresponds to the color of the row on the right?",
    }),
    getUserImageMessage({
      text: "That's correct. Here's an example image",
      dataUrl: exampleImage.dataUrl,
    }),
    getAssistantMessage({
      text: `Ok so each element in the outer array is a row and each element in a row is the mapping of the color to the integer. Here's the encoding for that example image: ${JSON.stringify(EXAMPLE_NUMBERS)}`,
    }),
    getUserImageMessage({
      text: `That's exactly correct! Now here's an image. Please call the function "validateEncoded" with the encoded image as the argument.`,
      dataUrl: numbersImage.dataUrl,
    }),
  ];

  const LOOP_STATE = {
    maxTries: 50,
    tries: 0,
  };

  while (LOOP_STATE.tries < LOOP_STATE.maxTries) {
    LOOP_STATE.tries++;

    const feedbackMessages = feedback.map((item) => {
      if (item.type === "retry") {
        return getUserTextMessage({
          text: `That didn't seem to work, here's what the validation function told us: ${item.reason}`,
        });
      }

      return getUserImageMessage({
        text: `That didn't quite work, here's what the validation function told us: ${item.reason}. Also, here's the image that your encoding produced, notice how it's not exactly the same as original.`,
        dataUrl: numbersImage.dataUrl,
      });
    });

    console.log(
      `SENDING REQUEST NUM ${LOOP_STATE.tries} WITH MESSAGES:`,
      JSON.stringify([...messages, ...feedbackMessages], null, 2),
    );

    const response = await openai.chat.completions.create({
      model: MODEL,
      tools: [getValidateEncodedTool()],
      messages: [...messages, ...feedbackMessages],
    });

    const toolCall = parseToolCall({ completion: response });

    if (!toolCall.ok) {
      feedback.push({
        type: "retry",
        reason: toolCall.reason,
      });
      continue;
    }

    const numbers = parseValidateEncodedToolCall(toolCall.data);

    if (!numbers.ok) {
      feedback.push({
        type: "retry",
        reason: numbers.reason,
      });
      continue;
    }

    await writeStreamImage({
      streamId: args.streamId,
      numbers: numbers.data,
    });

    const parsedNumbers = parseNumbers({ data: numbers.data });

    if (!parsedNumbers.ok) {
      feedback.push({
        type: "amend",
        numbers: numbers.data,
        reason: parsedNumbers.reason,
      });
      continue;
    }

    const equality = parseNumbersEquality({
      a: numbers.data,
      b: args.numbers,
    });

    if (!equality) {
      feedback.push({
        type: "amend",
        numbers: numbers.data,
        reason: "The encoded image does not match the expected encoding",
      });
      continue;
    }

    break;
  }
};

const EXAMPLE_NUMBERS = [
  [3, 8, 8, 0, 3, 8, 8, 0, 8, 0, 3, 1, 1, 1, 8, 8, 0, 3, 8, 3, 8],
  [3, 3, 0, 0, 5, 3, 0, 3, 8, 0, 3, 3, 8, 1, 1, 8, 1, 3, 1, 8, 3],
  [1, 5, 1, 3, 1, 1, 8, 3, 0, 0, 3, 8, 3, 0, 1, 0, 8, 8, 5, 5, 0],
  [5, 3, 0, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 3, 0, 0, 3],
  [0, 1, 3, 3, 2, 0, 0, 8, 0, 3, 3, 3, 3, 2, 0, 0, 8, 0, 3, 3, 1],
  [8, 0, 0, 8, 2, 1, 0, 0, 0, 3, 0, 3, 1, 2, 0, 0, 0, 8, 0, 1, 0],
  [1, 1, 5, 0, 2, 3, 3, 0, 3, 3, 0, 8, 1, 2, 1, 0, 8, 3, 1, 0, 0],
  [0, 0, 8, 8, 2, 3, 3, 5, 1, 0, 3, 0, 0, 2, 1, 0, 5, 0, 3, 0, 1],
  [0, 1, 0, 0, 2, 5, 1, 3, 0, 1, 3, 1, 1, 2, 8, 8, 0, 5, 0, 3, 8],
  [8, 3, 3, 3, 2, 5, 0, 8, 0, 3, 0, 8, 8, 2, 3, 3, 0, 0, 3, 3, 8],
  [1, 1, 1, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 8, 1, 3, 0, 0],
  [3, 3, 3, 0, 8, 8, 0, 8, 3, 0, 8, 8, 3, 0, 3, 0, 8, 1, 0, 1, 0],
  [8, 0, 0, 3, 3, 0, 8, 3, 0, 3, 3, 0, 1, 3, 3, 1, 8, 0, 0, 3, 8],
  [5, 1, 5, 1, 8, 3, 5, 0, 8, 3, 3, 8, 1, 8, 0, 0, 0, 3, 0, 0, 5],
  [1, 3, 1, 0, 1, 3, 1, 0, 5, 0, 3, 3, 8, 0, 8, 3, 8, 8, 8, 0, 0],
  [5, 3, 3, 3, 3, 8, 8, 0, 1, 1, 0, 8, 5, 1, 3, 0, 0, 8, 3, 1, 0],
  [3, 1, 3, 3, 8, 0, 3, 8, 0, 3, 1, 8, 3, 1, 8, 1, 1, 3, 8, 1, 0],
  [0, 3, 8, 3, 3, 0, 1, 3, 0, 3, 8, 5, 3, 0, 3, 1, 0, 3, 0, 0, 8],
  [3, 8, 3, 0, 1, 3, 8, 0, 1, 3, 8, 1, 0, 1, 1, 8, 5, 8, 3, 1, 1],
  [1, 5, 1, 3, 3, 1, 5, 3, 3, 1, 1, 3, 5, 0, 8, 8, 1, 1, 8, 0, 8],
  [1, 3, 0, 1, 3, 3, 1, 0, 0, 1, 5, 8, 3, 5, 3, 8, 0, 3, 8, 3, 8],
  [3, 1, 3, 0, 8, 0, 8, 0, 0, 1, 3, 1, 1, 0, 8, 8, 5, 1, 0, 1, 8],
  [3, 3, 1, 0, 3, 1, 8, 8, 0, 0, 5, 1, 8, 8, 1, 3, 3, 5, 3, 5, 8],
];
