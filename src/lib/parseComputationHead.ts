import { State } from "../types/State.js";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

export const parseComputationHead = (args: { state: State }): Maybe<State> => {
  if (!(args.state.downstream.length === 0)) {
    return createMaybe({
      ok: false,
      code: "STATE_HAS_DOWNSTREAM_TRANSITIONS",
      reason: `The state has ${args.state.downstream.length} downstream transitions, but the head must have none.`,
    });
  }

  return createMaybe({
    ok: true,
    data: args.state,
  });
};
