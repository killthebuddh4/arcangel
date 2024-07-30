import { getRuntime } from "./getRuntime.js";
import { Fault } from "../types/Fault.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";

export const setFault = (args: { fault: Fault }): Feedback<undefined> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "RUNTIME_NOT_FOUND",
      reason: "Runtime not found.",
    });
  }

  runtime.faults.push(args.fault);

  return createFeedback({
    ok: true,
    data: undefined,
  });
};
