import { Runtime } from "./Runtime.js";
import { Memory } from "./Memory.js";
import { Parameters } from "./Parameters.js";
import { Grid } from "./Grid.js";

export type Computation = {
  id: string;
  parameters: Parameters;
  runtime: Runtime;
  memory: Memory;
  output: Grid | null;
};
