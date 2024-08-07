import { writeFile } from "fs/promises";
import { Experiment } from "../types/Experiment.js";
import { createException } from "./createException.js";
import { getConfig } from "./getConfig.js";

export const writeExperimentJson = async (args: { experiment: Experiment }) => {
  try {
    return await writeFile(
      `./data/${getConfig().EXPERIMENT_ID}/${args.experiment.session.id}/experiment.json`,
      JSON.stringify(args.experiment, null, 2),
    );
  } catch {
    throw createException({
      code: "FAILED_TO_WRITE_TO_DISK",
      reason: "Failed to write experiment to disk",
    });
  }
};
