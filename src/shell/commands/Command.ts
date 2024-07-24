import { InitDimensions } from "./InitDimensions.js";
import { SetView } from "./SetView.js";
import { WriteCells } from "./WriteCells.js";

export type Command = InitDimensions | SetView | WriteCells;
