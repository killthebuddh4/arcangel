import { Model } from "./Model.js";
import { Operator } from "../operator/Operator.js";
import { State } from "./State.js";
import { Maybe } from "../Maybe.js";
import { v4 as uuidv4 } from "uuid";
import { Transition } from "./Transition.js";

export const iterate = (args: {
  model: Model;
  operator: Operator;
  state: State;
}): Maybe<Model> => {
  const isDefinedOperation = args.model.operators.some(
    (operator) => operator.id === args.operator.id,
  );

  if (!isDefinedOperation) {
    return {
      ok: false,
      reason: `operator ${args.operator.id} is not defined in the model`,
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
    (transition) => transition.operator.id === args.operator.id,
  );

  if (isOperationAlreadyApplied) {
    return {
      ok: false,
      reason: `operator ${args.operator.id} has already been applied to state ${args.state.id}`,
    };
  }

  const isOperationApplicable = args.operator.interface.upstream.every(
    (requirement) => {
      return args.state.data.some((datum) => {
        datum.predicate.id === requirement.predicate.id &&
          datum.observation.isPositive === requirement.observation.isPositive;
      });
    },
  );

  if (!isOperationApplicable) {
    return {
      ok: false,
      reason: `operator ${args.operator.id} is not applicable to state ${args.state.id}`,
    };
  }

  const result = args.operator.implementation(args.state.field);

  const state: State = {
    id: uuidv4(),
    field: result,
    data: args.model.predicates.map((predicate) => {
      return {
        predicate,
        observation: predicate.evaluate(result),
      };
    }),
    upstream: null,
    downstream: [],
  };

  const transition: Transition = {
    data: args.model.relations.map((relation) => {
      return {
        relation,
        observation: relation.evaluate(args.state.field, result),
      };
    }),
    operator: args.operator,
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
