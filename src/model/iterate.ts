import { Model } from "./Model.js";
import { Operation } from "./Operation.js";
import { State } from "./State.js";
import { Maybe } from "../Maybe.js";
import { v4 as uuidv4 } from "uuid";
import { Transition } from "./Transition.js";

export const iterate = (args: {
  model: Model;
  operation: Operation;
  state: State;
}): Maybe<Model> => {
  const isDefinedOperation = args.model.operations.some(
    (operation) => operation.id === args.operation.id,
  );

  if (!isDefinedOperation) {
    return {
      ok: false,
      reason: `operation ${args.operation.id} is not defined in the model`,
    };
  }

  const isStateInModel = args.model.states.some(
    (state) => state.id === args.state.id,
  );

  if (!isStateInModel) {
    return {
      ok: false,
      reason: `state ${args.state.id} is not in the model`,
    };
  }

  const isOperationAlreadyApplied = args.state.downstream.some(
    (transition) => transition.operation.id === args.operation.id,
  );

  if (isOperationAlreadyApplied) {
    return {
      ok: false,
      reason: `operation ${args.operation.id} has already been applied to state ${args.state.id}`,
    };
  }

  const isOperationApplicable = args.operation.interface.input.every(
    (input) => {
      return args.state.facts.some((fact) => {
        fact.predicate.id === input.predicate.id && fact.data === input.data;
      });
    },
  );

  if (!isOperationApplicable) {
    return {
      ok: false,
      reason: `operation ${args.operation.id} is not applicable to state ${args.state.id}`,
    };
  }

  const result = args.operation.implementation(args.state.field);

  const facts = args.model.predicates.map((predicate) => {
    return {
      predicate,
      data: predicate.implementation(result),
    };
  });

  const isResultValid = args.operation.interface.output.every((output) => {
    return facts.some((fact) => {
      fact.predicate.id === output.predicate.id && fact.data === output.data;
    });
  });

  if (!isResultValid) {
    return {
      ok: false,
      reason: `operation ${args.operation.id} produced an invalid result`,
    };
  }

  const state: State = {
    id: uuidv4(),
    field: result,
    facts,
    upstream: null,
    downstream: [],
  };

  const transition: Transition = {
    operation: args.operation,
    upstream: args.state,
    downstream: state,
  };

  args.state.downstream.push(transition);
  state.upstream = transition;

  return {
    ok: true,
    data: args.model,
  };
};
