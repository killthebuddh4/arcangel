import { Canvas } from "./Canvas.js";
import { Point } from "./Point.js";
import { createCanvas } from "./createCanvas.js";
import { getPoint } from "./getPoint.js";

export const drawPoints = (args: { canvas: Canvas; points: Point[] }) => {
  const canvas = createCanvas();

  canvas.points = args.canvas.points.map((point) => {
    return {
      x: point.x,
      y: point.y,
      value: point.value,
    };
  });

  for (const point of args.points) {
    const existingPoint = getPoint({
      canvas,
      x: point.x,
      y: point.y,
    });

    if (existingPoint !== undefined) {
      existingPoint.value = point.value;
    } else {
      canvas.points.push(point);
    }
  }

  return canvas;
};
