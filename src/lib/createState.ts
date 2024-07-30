import { Grid } from "../types/Grid.js";
import { State } from "../types/State.js";
import { Transition } from "../types/Transition.js";
import { Predicate } from "../types/Predicate.js";
import { Observation } from "../types/Observation.js";
import { v4 as uuidv4 } from "uuid";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

export const createState = (args: {
  grid: Grid;
  data?: Array<{ predicate: Predicate; observation: Observation }>;
  upstream?: Transition;
  downstream?: Transition[];
}): Maybe<State> => {
  return createMaybe({
    ok: true,
    data: {
      id: uuidv4(),
      type: "state",
      grid: args.grid,
      data: args.data ?? [],
      upstream: args.upstream ?? null,
      downstream: args.downstream ?? [],
    },
  });
};
