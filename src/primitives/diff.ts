import { Field } from "../field/Field.js";
import { Feedback } from "../feedback/Feedback.js";
import { compare } from "../field/compare.js";
import { createFeedback } from "../feedback/createFeedback.js";

export const diff = (args: { a: Field; b: Field }): Feedback<string> => {
  const comparison = compare({ a: args.a, b: args.b });

  if (comparison.result === "equal") {
    return createFeedback({
      ok: true,
      data: "The fields are equal.",
    });
  }

  if (comparison.result == "wrong dimensions") {
    // TODO For now we are assuming we take care to give the agent
    // fields of the same dimensions.
    throw new Error(`The fields have different dimensions.`);
  }

  const size = args.a.height * args.a.width;
  const mismatches = comparison.mismatches.length;
  const percentMismatch = (mismatches / size) * 100;

  if (percentMismatch > 50 || comparison.mismatches.length > 100) {
    return createFeedback({
      ok: false,
      reason: `The fields are very different. ${percentMismatch}% of the points do not match.`,
    });
  }

  return createFeedback({
    ok: false,
    reason: `The fields are somewhat different. ${percentMismatch}% of the points do not match. Here are the problematic points: ${JSON.stringify(comparison.mismatches)}`,
  });
};
