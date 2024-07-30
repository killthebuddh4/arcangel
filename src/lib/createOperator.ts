import { Grid } from "../types/Grid.js";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { v4 as uuidv4 } from "uuid";
import { Operator } from "../types/Operator.js";

export const createOperator = <P>(args: {
  name: string;
  description: string;
  implementation: (grid: Grid, params: P) => Grid;
}): Maybe<Operator<P>> => {
  return createMaybe({
    ok: true,
    data: {
      id: uuidv4(),
      name: args.name,
      description: args.description,
      implementation: args.implementation,
    },
  });
};
