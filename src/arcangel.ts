import { getRandomTask } from "./getRandomTask.js";
import { rotate } from "./operations/rotate.js";
import { readArc } from "./readArc.js";
import { createGridImage } from "./createGridImage.js";

const main = async () => {
  const arc = await readArc();
  const randomTask = getRandomTask({ arc });
  const grid = randomTask.task.test[0].input;
  const rotated90 = rotate({ grid, rotation: { degrees: 90 } });
  const rotated180 = rotate({ grid, rotation: { degrees: 180 } });
  const rotated270 = rotate({ grid, rotation: { degrees: 270 } });
  const rotatedNeg270 = rotate({ grid, rotation: { degrees: -270 } });
  await Promise.all([
    createGridImage({ grid, writePath: "data/images/g.png" }),
    createGridImage({ grid: rotated90, writePath: "data/images/g90.png" }),
    createGridImage({ grid: rotated180, writePath: "data/images/g180.png" }),
    createGridImage({ grid: rotated270, writePath: "data/images/g270.png" }),
    createGridImage({
      grid: rotatedNeg270,
      writePath: "data/images/gNeg270.png",
    }),
  ]);
};

main();
