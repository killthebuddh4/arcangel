import { Experiment } from "../types/Experiment.js";
import { readSessions } from "./readExperiments.js";
import { createException } from "./createException.js";

export const getResultSummary = async (args: { experimentId: string }) => {
  const sessions = await readSessions({
    experimentId: args.experimentId,
  });

  const successes = sessions.filter((e) => getProgress(e) === 100);
  const failures = sessions.filter((e) => getProgress(e) < 100);
  const numExperiments = sessions.length;
  const numSuccessful = successes.length;
  const numFailures = failures.length;

  const averageProgress =
    sessions.reduce((acc, experiment) => acc + getProgress(experiment), 0) /
    numExperiments;

  const averageFailureProgress =
    failures.reduce((acc, experiment) => acc + getProgress(experiment), 0) /
    failures.length;

  const averageNumMessages =
    sessions.reduce(
      (acc, experiment) => acc + experiment.session.messages.length,
      0,
    ) / numExperiments;

  const averageSuccessMessages =
    successes.reduce(
      (acc, experiment) => acc + experiment.session.messages.length,
      0,
    ) / numSuccessful;

  const averageFailureMessages =
    failures.reduce(
      (acc, experiment) => acc + experiment.session.messages.length,
      0,
    ) / numFailures;

  const averageToolCalls =
    sessions.reduce((acc, experiment) => {
      if (experiment.history.length === 0) {
        return acc;
      }

      return (
        acc + experiment.history[experiment.history.length - 1].numToolCalls
      );
    }, 0) / numExperiments;

  const averageFailureToolCalls =
    failures.reduce((acc, experiment) => {
      if (experiment.history.length === 0) {
        return acc;
      }

      return (
        acc + experiment.history[experiment.history.length - 1].numToolCalls
      );
    }, 0) / numFailures;

  const averageSuccessToolCalls =
    successes.reduce((acc, experiment) => {
      if (experiment.history.length === 0) {
        return acc;
      }

      return (
        acc + experiment.history[experiment.history.length - 1].numToolCalls
      );
    }, 0) / numSuccessful;

  let model: string | null = null;

  for (const experiment of sessions) {
    let found: string;
    try {
      found = (experiment.parameters as { model: string }).model;
    } catch {
      throw createException({
        code: "FAILED_TO_GET_MODEL",
        reason: `Failed to get model from experiment`,
      });
    }

    if (typeof found !== "string") {
      throw createException({
        code: "INVALID_MODEL",
        reason: `Model is not a string: ${found}`,
      });
    }

    if (model === null) {
      model = found;
    } else {
      if (found !== model) {
        throw createException({
          code: "MULTIPLE_MODELS",
          reason: `Multiple models found: ${model}, ${found}`,
        });
      }
    }
  }

  return {
    numExperiments,
    numSuccessful,
    numFailures,
    averageProgress,
    averageFailureProgress,
    averageNumMessages,
    averageSuccessMessages,
    averageFailureMessages,
    averageToolCalls,
    averageFailureToolCalls,
    averageSuccessToolCalls,
    model,
  };
};

const getProgress = (experiment: Experiment) => {
  if (experiment.history.length === 0) {
    return 0;
  }

  const lastEntry = experiment.history[experiment.history.length - 1];

  return lastEntry.progress;
};
