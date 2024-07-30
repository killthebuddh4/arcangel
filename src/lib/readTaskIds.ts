import { readdir } from "fs/promises";
import { getConfig } from "./getConfig.js";
import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

const config = getConfig();

export const readTaskIds = async (): Promise<Feedback<string[]>> => {
  let files: string[];
  try {
    files = await readdir(config.TASKS_DIR);
  } catch {
    return createFeedback({
      ok: false,
      code: "DIRECTORY_READ_ERROR",
      reason: `Failed to read tasks directory: ${config.TASKS_DIR}`,
    });
  }

  for (const filename of files) {
    if (!filename.endsWith(".json")) {
      return createFeedback({
        ok: false,
        code: "INVALID_FILE_EXTENSION",
        reason: `Expected a JSON file, but got ${filename}.`,
      });
    }
  }

  return createFeedback({
    ok: true,
    data: files.map((filename) => filename.replace(".json", "")),
  });
};
