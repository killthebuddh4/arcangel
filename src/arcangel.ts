import { getTask } from "./field/readTask.js";
import { getTaskIds } from "./field/getTaskIds.js";
import { getRgb } from "./field/getRgb.js";
import { createField as createField } from "./field/createField.js";
import { write as writeField } from "./field/setPoint.js";
import { isEqual } from "./field/isEqual.js";
import { isRotation180 } from "./field/isRotation180.js";
import { isRotation270 } from "./field/isRotation270.js";
import { isRotation90 } from "./field/isRotation90.js";
import { isCropped } from "./field/isCropped.js";
import { renderField as renderField } from "./field/createImage.js";
import { save as saveField } from "./field/writeImage.js";

const main = async () => {
  const taskIds = await getTaskIds();

  const tasks = await Promise.all(
    taskIds.map((id) => {
      return getTask({ id }).then((task) => {
        if (!task.ok) {
          throw new Error(task.reason);
        }

        return {
          id,
          data: task.data,
        };
      });
    }),
  );

  for (const task of tasks.slice(0, tasks.length)) {
    const getField = (numbers: number[][]) => {
      const height = numbers.length;
      const width = numbers[0].length;
      const field = createField({ height, width });

      if (!field.ok) {
        throw new Error(field.reason);
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const value = numbers[y][x];

          writeField({
            field: field.data,
            x,
            y,
            value: getRgb({ color: value }),
          });
        }
      }

      return field.data;
    };

    const input = getField(task.data.train[0].input);
    const inputRendered = await renderField({ field: input });
    const output = getField(task.data.train[0].output);
    const outputRendered = await renderField({ field: output });
    const evaluation90 = isRotation90.evaluate(input, output);
    const evaluation180 = isRotation180.evaluate(input, output);
    const evaluation270 = isRotation270.evaluate(input, output);
    const evaluation360 = isEqual.evaluate(input, output);
    const evaluationCropped = isCropped.evaluate(input, output);

    if (
      [
        evaluation90,
        evaluation180,
        evaluation270,
        evaluation360,
        evaluationCropped,
      ].some(({ isPositive }) => isPositive)
    ) {
      saveField({
        image: inputRendered,
        path: `./data/images/${task.id}-test-input.png`,
      });
      saveField({
        image: outputRendered,
        path: `./data/images/${task.id}-test-output.png`,
      });
    }
  }
};

main();
