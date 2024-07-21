import { getRandomTask } from "./getRandomTask.js";
import { readArc } from "./readArc.js";
import { getRotated } from "./field/getRotated.js";
import { getFromGrid } from "./field/getFromGrid.js";
import { getImage } from "./field/getImage.js";
import { genXDimension } from "./field/genXDimension.js";
import { genYDimension } from "./field/genYDimension.js";

const main = async () => {
  const arc = await readArc();
  const randomTask = getRandomTask({ arc });
  const grid = randomTask.task.test[0].input;
  const field = getFromGrid({ grid });

  const fieldImage = await getImage({
    field,
    writePath: "data/images/field.png",
  });

  const xDimension = await genXDimension({
    fieldDataUrl: fieldImage.dataUrl,
  });

  console.log("FIELD -----------------------\n\n");

  console.log(xDimension.choices[0].message.content);

  const yDimension = await genYDimension({
    fieldDataUrl: fieldImage.dataUrl,
  });

  console.log(yDimension.choices[0].message.content);

  const rotated90 = getRotated({ field, degrees: 90 });

  const rotated90Image = await getImage({
    field: rotated90,
    writePath: "data/images/rotated90.png",
  });

  const xDimensionRotated90 = await genXDimension({
    fieldDataUrl: rotated90Image.dataUrl,
  });

  console.log("\n\nROTATED -----------------------\n\n");

  console.log(xDimensionRotated90.choices[0].message.content);

  const yDimensionRotated90 = await genYDimension({
    fieldDataUrl: rotated90Image.dataUrl,
  });

  console.log(yDimensionRotated90.choices[0].message.content);
};

main();
