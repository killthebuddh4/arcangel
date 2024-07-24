import { Canvas } from "./Canvas.js";
import { createCanvas } from "./createCanvas.js";

export const cloneCanvas = (args: { canvas: Canvas }): Canvas => {
  return createCanvas({
    points: args.canvas.points.map((point) => {
      return {
        x: point.x,
        y: point.y,
        value: point.value,
      };
    }),
  });
};
