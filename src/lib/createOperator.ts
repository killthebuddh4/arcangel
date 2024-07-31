import { Grid } from "../types/Grid.js";
import { v4 as uuidv4 } from "uuid";
import { Operator } from "../types/Operator.js";

export const createOperator = <P>(args: {
  name: string;
  description: string;
  implementation: (grid: Grid, params: P) => Grid;
}): Operator<P> => {
  return {
    id: uuidv4(),
    name: args.name,
    description: args.description,
    implementation: args.implementation,
  };
};
