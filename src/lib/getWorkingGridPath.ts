import { Session } from "../types/Session.js";

export const getWorkingGridPath = (args: { session: Session }): string => {
  return `./data/images/sessions/${args.session.id}/${args.session.numToolCalls}.png`;
};
