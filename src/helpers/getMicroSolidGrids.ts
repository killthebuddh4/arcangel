import { createGrid } from "../lib/createGrid.js";
import { createCell } from "../lib/createCell.js";
import { Color } from "../types/Color.js";
import { Grid } from "../types/Grid.js";
import { createMaybe } from "../lib/createMaybe.js";
import { Maybe } from "../types/Maybe.js";
import { Cell } from "../types/Cell.js";

export const getMicroSolidGrid = (args: { color: Color }): Maybe<Grid> => {
  const cells: Cell[][] = [];

  for (let y = 0; y < 4; y++) {
    const row: Cell[] = [];

    for (let x = 0; x < 4; x++) {
      const maybeCell = createCell({
        x,
        y,
        color: args.color,
      });

      if (!maybeCell.ok) {
        return createMaybe({
          ok: false,
          code: "CREATE_CELL_FAILED",
          reason: `Failed to create cell: ${maybeCell.reason}`,
        });
      }

      row.push(maybeCell.data);
    }

    cells.push(row);
  }

  const maybeGrid = createGrid({ height: 4, width: 4, cells });

  if (!maybeGrid.ok) {
    return createMaybe({
      ok: false,
      code: "CREATE_GRID_FAILED",
      reason: `Failed to create grid: ${maybeGrid.reason}`,
    });
  }

  return createMaybe({ ok: true, data: maybeGrid.data });
};
