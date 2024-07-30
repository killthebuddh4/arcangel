import { readdir } from "fs/promises";
import { getConfig } from "./getConfig.js";
import { createMaybe } from "./createMaybe.js";
import { Maybe } from "../types/Maybe.js";

export const readTaskIds = async (): Promise<Maybe<string[]>> => {
  const files = await readdir(getConfig().TASKS_DIR);

  for (const filename of files) {
    if (!filename.endsWith(".json")) {
      return createMaybe({
        ok: false,
        code: "INVALID_FILE_EXTENSION",
        reason: `Invalid file extension: ${filename}, expected .json`,
      });
    }
  }

  return createMaybe({
    ok: true,
    data: files.map((filename) => filename.replace(".json", "")),
  });
};
