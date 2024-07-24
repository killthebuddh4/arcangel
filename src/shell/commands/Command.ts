import { SetBounds } from "./SetBounds.js";
import { SetView } from "./SetView.js";
import { WriteColor } from "./WriteColor.js";

export type Command = SetBounds | SetView | WriteColor;
