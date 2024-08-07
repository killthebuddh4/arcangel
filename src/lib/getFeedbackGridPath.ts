import { Session } from "../types/Session.js";
import { getConfig } from "./getConfig.js";

export const getFeedbackGridPath = (args: { session: Session }): string => {
  return `./data/${getConfig().EXPERIMENT_ID}/${args.session.id}/${args.session.numToolCalls}-feedback.png`;
};
