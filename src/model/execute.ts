import { Feedback } from "../feedback/Feedback.js";
import { Transition } from "./Transition.js";
import { createFeedback } from "../feedback/createFeedback.js";
import { getOperator } from "./getOperator.js";
import { getHeads } from "./getHeads.js";
import { getPredicates } from "./getPredicates.js";
import { getRelations } from "./getRelations.js";
import { createState } from "./createState.js";
import { createTransition } from "./createTransition.js";

type IterateFeedbackCode =
  | "OPERATOR_NOT_DEFINED"
  | "NO_STATES_IN_MODEL"
  | "OPERATOR_ALREADY_APPLIED"
  | "OPERATOR_NOT_APPLICABLE";

export const execute = (args: {
  operatorId: string;
}): Feedback<Transition, IterateFeedbackCode> => {
  const operator = getOperator({ operatorId: args.operatorId });

  if (operator === undefined) {
    return createFeedback({
      ok: false,
      code: "OPERATOR_NOT_DEFINED",
      reason: `operator ${args.operatorId} is not defined in the model`,
    });
  }

  const heads = getHeads();

  if (heads.length === 0) {
    return createFeedback({
      ok: false,
      code: "NO_STATES_IN_MODEL",
      reason: `The model has no states yet.`,
    });
  }

  const head = heads[0];

  const isOperationAlreadyApplied = head.downstream.some(
    (transition) => transition.operator.id === args.operatorId,
  );

  if (isOperationAlreadyApplied) {
    return createFeedback({
      ok: false,
      code: "OPERATOR_ALREADY_APPLIED",
      reason: `operator ${args.operatorId} has already been applied to head state ${head.id}`,
    });
  }

  const isOperationApplicable = operator.interface.upstream.every(
    (requirement) => {
      return head.data.some((datum) => {
        datum.predicate.id === requirement.predicate.id &&
          datum.observation.isPositive === requirement.observation.isPositive;
      });
    },
  );

  if (!isOperationApplicable) {
    return createFeedback({
      ok: false,
      code: "OPERATOR_NOT_APPLICABLE",
      reason: `operator ${args.operatorId} is not applicable to state ${head.id}`,
    });
  }

  const result = operator.implementation(head.field);

  const predicates = getPredicates();

  const state = createState({
    field: result,
    data: predicates.map((predicate) => {
      return {
        predicate,
        observation: predicate.evaluate(result),
      };
    }),
    upstream: null,
    downstream: [],
  });

  const relations = getRelations();

  const transition = createTransition({
    data: relations.map((relation) => {
      return {
        relation,
        observation: relation.evaluate(head.field, result),
      };
    }),
    operator,
    upstream: head,
    downstream: state,
  });

  return createFeedback({
    ok: true,
    data: transition,
  });
};
