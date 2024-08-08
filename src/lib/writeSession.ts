import { writeFile } from "fs/promises";
import { createException } from "./createException.js";
import { getConfig } from "./getConfig.js";
import { Session } from "../types/Session.js";

export const writeSession = async (args: {
  session: Session;
  suffix: string;
}) => {
  const path = `./data/${getConfig().EXPERIMENT_ID}/${args.session.id}/${args.suffix}.json`;
  try {
    return await writeFile(path, JSON.stringify(args.session, null, 2));
  } catch {
    throw createException({
      code: "FAILED_TO_WRITE_TO_DISK",
      reason: `Failed to write session to disk at path: ${path}`,
    });
  }
};
