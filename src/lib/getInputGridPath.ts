import { Session } from "../types/Session.js";

export const getInputGridPath = (args: { session: Session }): string => {
  return `./data/images/sessions/${args.session.id}/input.png`;
};
