import { createException } from "./createException.js";
import { readdir } from "fs/promises";
import { readFile } from "fs/promises";
import { Session } from "../types/Session.js";
import { getConfig } from "./getConfig.js";

export const readSessions = async () => {
  let sessionIds: string[];
  try {
    sessionIds = await readdir(`./data/${getConfig().EXPERIMENT_ID}`);
  } catch {
    throw createException({
      code: "FAILED_TO_READ_EXP_IDS_FROM_DISK",
      reason: `Failed to read session filenames from disk: ${getConfig().EXPERIMENT_ID}`,
    });
  }

  const sessions: Session[] = [];

  for (const sessionId of sessionIds) {
    let data: string;
    try {
      data = await readFile(
        `./data/${getConfig().EXPERIMENT_ID}/${sessionId}/result.json`,
        "utf-8",
      );
    } catch {
      throw createException({
        code: "FAILED_TO_READ_EXPERIMENT_FROM_DISK",
        reason: `Failed to read experiment from disk: ${sessionId}`,
      });
    }

    let json;
    try {
      json = JSON.parse(data);
    } catch {
      throw createException({
        code: "FAILED_TO_PARSE_JSON",
        reason: "Failed to parse JSON",
      });
    }

    // TODO Write a parser.
    sessions.push(json as Session);
  }

  return sessions;
};
