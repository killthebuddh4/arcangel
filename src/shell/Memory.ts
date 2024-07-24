import { Grid } from "../grid/Grid.js";
import { Command } from "./commands/Command.js";

export type Memory = {
  commands: Command[];
  grid: Grid | null;
};
