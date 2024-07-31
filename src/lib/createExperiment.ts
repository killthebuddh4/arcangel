import { Experiment } from "../types/Experiment.js";
import { Session } from "../types/Session.js";

export const createExperiment = (args: {
  name: string;
  description: string;
  session: Session;
  parameters: unknown;
}): Experiment => {
  return {
    name: args.name,
    description: args.description,
    session: args.session,
    parameters: args.parameters,
    history: [],
  };
};
