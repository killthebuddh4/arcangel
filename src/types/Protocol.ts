import { Computation } from "./Computation.js";
import { Operator } from "./Operator.js";
import { State } from "./State.js";

export type GetOperator = (args: { computation: Computation }) => Operator;
export type GetNext = (args: { computation: Computation }) => State;
export type AddNext = (args: { computation: Computation; next: State }) => void;
export type IsFinished = (args: { computation: Computation }) => boolean;
