import * as Arc from "./Arc.js";
import { readFile } from "fs/promises";
import { join } from "path";

export const readArc = async () => {
  const data = await readFile(join(process.cwd(), "data/arc.json"), "utf-8");
  return JSON.parse(data) as Arc.Arc;
};
