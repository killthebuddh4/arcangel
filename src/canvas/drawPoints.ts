import { Canvas } from "./Canvas.js";
import { Point } from "./Point.js";
import { getPoint } from "./getPoint.js";

export const drawPoints = (args: { canvas: Canvas; points: Point[] }) => {
  console.log(`drawPoints :: drawing points ::`, JSON.stringify(args.points));

  for (const point of args.points) {
    const existingPoint = getPoint({
      canvas: args.canvas,
      x: point.x,
      y: point.y,
    });

    if (existingPoint === undefined) {
      args.canvas.points.push(point);
    } else {
      existingPoint.value = point.value;
    }
  }

  return args.canvas;
};
