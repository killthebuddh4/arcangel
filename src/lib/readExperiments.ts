import { Experiment } from "../types/Experiment.js";
import { createException } from "./createException.js";
import { readdir } from "fs/promises";
import { readFile } from "fs/promises";

// TODO We have a naming problem because the data type for each "session"
// is called "Experiment". So we have to rethink the name of the higher level
// thing that contains multiple "Experiments". Maybe the higher level thing
// is a ???
export const readSessions = async (args: { experimentId: string }) => {
  let sessions: string[];
  try {
    sessions = await readdir(`./data/${args.experimentId}`);
  } catch {
    throw createException({
      code: "FAILED_TO_READ_EXP_IDS_FROM_DISK",
      reason: `Failed to read session filenames from disk: ${args.experimentId}`,
    });
  }

  const experiments: Experiment[] = [];

  for (const session of sessions) {
    let data: string;
    try {
      data = await readFile(
        `./data/${args.experimentId}/${session}/experiment.json`,
        "utf-8",
      );
    } catch {
      throw createException({
        code: "FAILED_TO_READ_EXPERIMENT_FROM_DISK",
        reason: `Failed to read experiment from disk: ${session}`,
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
    experiments.push(json as Experiment);
  }

  return experiments;
};
