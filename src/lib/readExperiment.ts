import { Experiment } from "../types/Experiment.js";
import { createException } from "./createException.js";
import { readFile } from "fs/promises";

export const readExperiment = async (args: { sessionId: string }) => {
  let data: string;
  try {
    data = await readFile(
      `./data/images/sessions/${args.sessionId}/experiment.json`,
      "utf-8",
    );
  } catch {
    throw createException({
      code: "FAILED_TO_READ_FROM_DISK",
      reason: "Failed to read experiment from disk",
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
  return json as Experiment;
};
