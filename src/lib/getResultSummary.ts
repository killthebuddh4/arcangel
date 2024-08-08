import { Session } from "../types/Session.js";
import { readSessions } from "./readSessions.js";
import { createException } from "./createException.js";
import { getDiff } from "./getDiff.js";

const getNumMessages = (session: Session) => {
  let numMessages = 0;
  numMessages += session.instructions.messages.length;
  for (const history of session.history) {
    numMessages += history.messages.length;
  }
  return numMessages;
};

const getNumToolCalls = (session: Session, opts?: { name?: string }) => {
  let numToolCalls = 0;

  for (const history of session.history) {
    if (history.type === "feedback") {
      for (const message of history.messages) {
        if (message.role === "tool") {
          if (typeof opts?.name === undefined || opts?.name === message.name) {
            numToolCalls++;
          }
        }
      }
    }
  }

  return numToolCalls;
};

export const getResultSummary = async () => {
  const sessions = await readSessions();
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
    sessions.reduce((acc, experiment) => acc + getNumMessages(experiment), 0) /
    numExperiments;

  const averageSuccessMessages =
    successes.reduce((acc, experiment) => acc + getNumMessages(experiment), 0) /
    numSuccessful;

  const averageFailureMessages =
    failures.reduce((acc, experiment) => acc + getNumMessages(experiment), 0) /
    numFailures;

  const averageToolCalls =
    sessions.reduce((acc, experiment) => {
      return acc + getNumToolCalls(experiment);
    }, 0) / numExperiments;

  const averageFailureToolCalls =
    failures.reduce((acc, experiment) => {
      return acc + getNumToolCalls(experiment);
    }, 0) / numFailures;

  const averageSuccessToolCalls =
    successes.reduce((acc, experiment) => {
      return acc + getNumToolCalls(experiment);
    }, 0) / numSuccessful;

  const numToolCallsByName = sessions.reduce(
    (acc, experiment) => {
      for (const name of experiment.environment.tools.map(
        (t) => t.spec.function.name,
      )) {
        if (name in acc) {
          acc[name] += getNumToolCalls(experiment, { name });
        } else {
          acc[name] = getNumToolCalls(experiment, { name });
        }
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  let model: string | null = null;

  for (const experiment of sessions) {
    const found = experiment.config.model;

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
    numToolCallsByName,
    averageToolCalls,
    averageFailureToolCalls,
    averageSuccessToolCalls,
    model,
  };
};

const getProgress = (session: Session) => {
  const diff = getDiff({
    lhs: session.environment.input,
    rhs: session.memory.grid,
  });

  const size =
    session.environment.input.height * session.environment.input.width;

  return ((size - diff.diff.length) / size) * 100;
};
