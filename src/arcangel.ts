import { Point } from "./canvas/Point.js";
import { getTask } from "./task/getTask.js";
import { createCanvas } from "./canvas/createCanvas.js";
import { writeImage } from "./writeImage.js";
import { drawPoints } from "./canvas/drawPoints.js";

const TASK_ID = "1c786137";

const main = async () => {
  const task = await getTask({ id: TASK_ID });

  if (!task.ok) {
    throw new Error(task.reason);
  }

  const points: Point[] = [];

  for (let y = 0; y < task.data.train[0].input.length; y++) {
    for (let x = 0; x < task.data.train[0].input[0].length; x++) {
      points.push({
        x,
        y,
        value: task.data.train[0].input[y][x],
      });
    }
  }
  [];

  const canvas = createCanvas({ points });

  writeImage({ canvas, path: "data/canvas.png" });

  const newPoints = [];

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      newPoints.push({
        x,
        y,
        value: 4,
      });
    }
  }

  for (let y = 5; y < 10; y++) {
    for (let x = 5; x < 10; x++) {
      newPoints.push({
        x,
        y,
        value: 5,
      });
    }
  }

  const newCanvas = drawPoints({ canvas, points: newPoints });

  writeImage({ canvas: newCanvas, path: "data/new-canvas.png" });
};

main();
