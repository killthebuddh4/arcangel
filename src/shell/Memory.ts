import { Canvas } from "../canvas/Canvas.js";
import { Command } from "./commands/Command.js";

export type Memory = {
  view: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };

  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };

  commands: Command[];

  canvas: Canvas;
};
