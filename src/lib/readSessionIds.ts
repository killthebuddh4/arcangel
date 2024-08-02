import { readdir } from "fs/promises";
import { createException } from "./createException.js";

export const readSessionIds = async () => {
  try {
    return await readdir("./data/images/sessions");
  } catch {
    throw createException({
      code: "FAILED_TO_READ_FROM_DISK",
      reason: "Failed to read session IDs from disk",
    });
  }
};
