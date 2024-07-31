import { Session } from "./Session.js";

export type Experiment = {
  name: string;
  description: string;
  session: Session;
  parameters: unknown;
  history: Array<{
    numTokens: number;
    numToolCalls: number;
    progress: number;
  }>;
};
