import { readTask } from "./lib/readTask.js";
import { getTaskIds } from "./lib/getTaskIds.js";
import { getRgb } from "./lib/getRgb.js";
import { createField as createField } from "./lib/createField.js";
import { write as writeField } from "./lib/setPoint.js";
import { isEqual } from "./lib/isSameField.js";
import { isRotation180 } from "./lib/is180Rotation.js";
import { isRotation270 } from "./lib/is270Rotation.js";
import { isRotation90 } from "./lib/is90Rotation.js";
import { isCropped } from "./lib/isCroppedVersion.js";
import { renderField as renderField } from "./lib/createImage.js";
import { save as saveField } from "./lib/writeImage.js";

const main = async () => {
  const taskIds = await getTaskIds();

  const tasks = await Promise.all(
    taskIds.map((id) => {
      return readTask({ id }).then((task) => {
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
