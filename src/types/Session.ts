import { Grid } from "./Grid.js";
import { ChatMessage } from "./ChatMessage.js";
import { Tool } from "./Tool.js";

export type Session = {
  id: string;
  startTime: number;
  elapsedTime: number | null;
  taskId: string;
  maxIterations: number;
  currentIteration: number;
  numToolCalls: number;
  targetGrid: Grid;
  workingGrid: Grid;
  messages: ChatMessage[];
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: Tool<any>[];
  outputGrid: Grid | null;
};
