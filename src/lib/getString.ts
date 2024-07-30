import { Grid } from "../types/Grid.js";

export const getString = (args: { grid: Grid }): string => {
  const rows: string[] = [];

  for (let y = 0; y < args.grid.height; y++) {
    const cells: string[] = [];

    for (let x = 0; x < args.grid.width; x++) {
      cells.push(args.grid.cells[y][x].color);
    }

    rows.push(cells.join(" | "));
  }

  return rows.join("\n");
};
