import { Field } from "./Field.js";
import { Point } from "./Point.js";
import { Chalk } from "chalk";

export const print = (args: { field: Field }) => {
  const chalk = new Chalk();

  const result = [];

  for (let y = 0; y < args.field.height; y++) {
    const row = [];

    for (let x = 0; x < args.field.width; x++) {
      const point: Point = args.field.points[y][x];
      const elem = chalk.bgRgb(...point.value)(" ");
      row.push(elem);
    }

    result.push(row.join(""));
  }

  console.log(result.join("\n"));
};
