import { exec } from "./shell/exec.js";
import { getTask } from "./task/getTask.js";
import { createGrid } from "./grid/createGrid.js";
import { getRgb } from "./getRgb.js";

const main = async () => {
  const task = await getTask({ id: "6ecd11f4" });

  if (!task.ok) {
    throw new Error(task.reason);
  }

  const cells = task.data.train[0].input
    .map((row, y) => {
      return row.map((number, x) => {
        return {
          x,
          y,
          value: getRgb({ color: number }),
        };
      });
    })
    .flat();

  const height = task.data.train[0].input.length;
  const width = task.data.train[0].input[0].length;

  const grid = createGrid({ height, width, opts: { cells } });

  await exec({ grid });
};

main();
