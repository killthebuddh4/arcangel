import { getTask } from "./task/getTask.js";
import { getRgb } from "./task/getRgb.js";
import { create as createField } from "./field/create.js";
import { print as printField } from "./field/print.js";
import { write as writeField } from "./field/write.js";
import { render as renderField } from "./field/render.js";
import { save as saveField } from "./field/save.js";

const main = async () => {
  const task = await getTask({ id: "6ecd11f4" });
  if (!task.ok) {
    throw new Error(task.reason);
  }

  const height = task.data.train[0].input.length;
  const width = task.data.train[0].input[0].length;
  const field = createField({ height, width });

  if (!field.ok) {
    throw new Error(field.reason);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = task.data.train[0].input[y][x];

      writeField({
        field: field.data,
        x,
        y,
        value: getRgb({ color: value }),
      });
    }
  }

  const rendered = await renderField({ field: field.data });
  printField({ field: field.data });
  saveField({ image: rendered, path: "output.png" });
};

main();
