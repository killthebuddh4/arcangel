import { z } from "zod";
import { Grid } from "../types/Grid.js";
import { createTool } from "../lib/createTool.js";
import { setCellColor } from "../lib/setCellColor.js";

export const getSetColorRedTool = (args: { workingGrid: Grid }) => {
  return createTool({
    name: "setCellsToRed",
    description: "Sets the color of the targeted cells to red.",
    inputSchema: z.object({
      cells: z.array(
        z.object({
          x: z.number(),
          y: z.number(),
        }),
      ),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
    handler: (params): { success: boolean } => {
      for (const cell of params.cells) {
        setCellColor({
          grid: args.workingGrid,
          x: cell.x,
          y: cell.y,
          color: "red",
        });
      }

      return { success: true };
    },
  });
};
