import { InitDimensions } from "./InitDimensions.js";
import { SetView } from "./SetView.js";
import { WriteCell } from "./WriteCell.js";

export type Command = InitDimensions | SetView | WriteCell;
