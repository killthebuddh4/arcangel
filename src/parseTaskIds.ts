import { readdir } from "fs/promises";
import { config } from "./config.js";
import { ParseResult } from "./ParseResult.js";

export const parseTaskIds = async (): Promise<ParseResult<string[]>> => {
  const files = await readdir(config.TASKS_DIR);

  for (const filename of files) {
    if (!filename.endsWith(".json")) {
      return {
        ok: false,
        reason: `Invalid task filename: ${filename}`,
      };
    }
  }

  return {
    ok: true,
    data: files.map((filename) => filename.replace(".json", "")),
  };
};
