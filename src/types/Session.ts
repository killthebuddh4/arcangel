import { Grid } from "./Grid.js";
import { ChatMessage } from "./ChatMessage.js";
import { Tool } from "./Tool.js";
import { Exception } from "./Exception.js";
import { ChatCompletion } from "openai/resources/index.mjs";

export type Generation = {
  id: string;
  type: "generation";
  time: number;
  code: string;
  messages: ChatMessage[];
};

export type Feedback = {
  id: string;
  type: "feedback";
  time: number;
  code: string;
  messages: ChatMessage[];
};

// Note there's another type Fault in Fault.ts, this is basically
// the MVP of that type.
export type Fault = {
  id: string;
  type: "fault";
  time: number;
  code: string;
  reason: string;
  messages: ChatMessage[];
};

export type Environment = {
  id: string;
  type: "environment";
  input: Grid;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: Tool<any>[];
};

export type Config = {
  id: string;
  type: "options";
  model: string;
  maxSteps: number;
  maxTime: number;
  maxToolCalls: number;
  maxMessages: number;
  maxTokens: number;
};

export type Memory = {
  id: string;
  type: "memory";
  grid: Grid;
};

export type Instructions = {
  id: string;
  type: "instructions";
  messages: ChatMessage[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response = ChatCompletion;

export type Exit =
  | {
      id: string;
      time: number;
      ok: false;
      exception: Exception;
    }
  | {
      id: string;
      time: number;
      ok: true;
    };

export type Session = {
  id: string;
  environment: Environment;
  instructions: Instructions;
  config: Config;
  memory: Memory;
  history: (Generation | Feedback | Fault)[];
  exit: Exit | null;
};
