import { z } from "zod";
import { Grid } from "../types/Grid.js";
import { createTool } from "../lib/createTool.js";

export const getGetDimensionsTool = (args: { workingGrid: Grid }) => {
  return createTool({
    name: "getDimensions",
    description: "Returns the dimensions of the grid.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      height: z.number(),
      width: z.number(),
      minX: z.number(),
      maxX: z.number(),
      minY: z.number(),
      maxY: z.number(),
    }),
    handler: () => {
      return {
        height: args.workingGrid.height,
        width: args.workingGrid.width,
        minX: 0,
        maxX: args.workingGrid.width - 1,
        minY: 0,
        maxY: args.workingGrid.height - 1,
      };
    },
  });
};
