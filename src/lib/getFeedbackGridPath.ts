import { Session } from "../types/Session.js";

export const getFeedbackGridPath = (args: { session: Session }): string => {
  return `./data/images/sessions/${args.session.id}/${args.session.numToolCalls}-feedback.png`;
};
