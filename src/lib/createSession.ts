import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { Tool } from "../types/Tool.js";
import { Grid } from "../types/Grid.js";
import { v4 as uuidv4 } from "uuid";
import { Session } from "../types/Session.js";

export const createSession = (args: {
  taskId: string;
  maxIterations: number;
  targetGrid: Grid;
  workingGrid: Grid;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: Tool<any>[];
}): Maybe<Session> => {
  return createMaybe({
    ok: true,
    data: {
      id: uuidv4(),
      taskId: args.taskId,
      maxIterations: args.maxIterations,
      currentIteration: 0,
      numToolCalls: 0,
      targetGrid: args.targetGrid,
      workingGrid: args.workingGrid,
      messages: [],
      tools: args.tools,
      outputGrid: null,
    },
  });
};
