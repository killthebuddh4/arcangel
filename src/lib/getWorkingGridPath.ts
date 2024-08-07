import { Session } from "../types/Session.js";
import { getConfig } from "./getConfig.js";

export const getWorkingGridPath = (args: { session: Session }): string => {
  return `./data/${getConfig().EXPERIMENT_ID}/${args.session.id}/${args.session.numToolCalls}.png`;
};
