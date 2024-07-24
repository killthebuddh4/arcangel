import { Canvas } from "../canvas/Canvas.js";
import { Command } from "./commands/Command.js";

export type Memory = {
  dimensions: {
    height: number;
    width: number;
  };
  commands: Command[];
  canvas: Canvas;
};
