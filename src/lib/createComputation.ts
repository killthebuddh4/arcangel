import { Parameters } from "../types/Parameters.js";
import { Runtime } from "../types/Runtime.js";
import { v4 as uuidv4 } from "uuid";
import { createMaybe } from "./createMaybe.js";
import { Maybe } from "../types/Maybe.js";
import { Computation } from "../types/Computation.js";

export const createComputation = (args: {
  parameters: Parameters;
  runtime: Runtime;
}): Maybe<Computation> => {
  return createMaybe({
    ok: true,
    data: {
      id: uuidv4(),
      parameters: args.parameters,
      runtime: args.runtime,
      memory: {
        id: uuidv4(),
        states: [],
        transitions: [],
        faults: [],
      },
      output: null,
    },
  });
};
