import { readFile } from "fs/promises";
import { join } from "path";
import { config } from "./config.js";
import { ParseResult } from "./ParseResult.js";

export const readTask = async (args: {
  id: string;
}): Promise<ParseResult<string>> => {
  try {
    const filename = `${args.id}.json`;
    const content = await readFile(join(config.TASKS_DIR, filename), "utf-8");

    return {
      ok: true,
      data: content,
    };
  } catch {
    return {
      ok: false,
      reason: `Failed to read task data from disk`,
    };
  }
};
