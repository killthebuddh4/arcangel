import { Grid } from "./Grid.js";

export const getCell = (args: { x: number; y: number; canvas: Grid }) => {
  const cell = args.canvas.cells.find(
    (point) => point.x === args.x && point.y === args.y,
  );

  if (cell === undefined) {
    throw new Error(`Cell not found at x: ${args.x}, y: ${args.y}`);
  }

  return cell;
};
