import * as Arc from "./Arc.js";
import { getGridUrl } from "./getGridUrl.js";
import { getTask } from "./getTask.js";

export const getGrid = async (args: { url: string }): Promise<Arc.Grid> => {
  const url = getGridUrl({ url: args.url });
  const task = await getTask({ id: url.id });

  const numbers = (() => {
    try {
      const t = task as {
        [key: string]: {
          [key: string]: number[][];
        }[];
      };

      return t[url.trainOrTest][url.n][url.inputOrOutput];
    } catch (e) {
      throw new Error(
        `Failed to read numbers from task and grid url: ${args.url}`,
      );
    }
  })();

  if (numbers.length === 0) {
    throw new Error("Grid must have at least one row");
  }

  const numCols = numbers[0].length;

  for (const row of numbers) {
    if (row.length !== numCols) {
      throw new Error("All rows must have the same length");
    }
  }

  for (const row of numbers) {
    for (const num of row) {
      if (!Number.isInteger(num)) {
        throw new Error("All values must be integers");
      }

      if (num < 0) {
        throw new Error("All values must be non-negative");
      }

      if (num > 9) {
        throw new Error("All values must be at most 9");
      }
    }
  }

  return { url, cells: numbers as Arc.Value[][] };
};
