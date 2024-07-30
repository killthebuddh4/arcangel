import { readdir } from "fs/promises";
import { config } from "./config.js";

export const getTaskIds = async () => {
  const files = await readdir(config.TASKS_DIR);

  for (const filename of files) {
    if (!filename.endsWith(".json")) {
      throw new Error(`Expected a JSON file, but got ${filename}.`);
    }
  }

  return files.map((filename) => filename.replace(".json", ""));
};
