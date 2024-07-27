import { v4 as uuid } from "uuid";
import { Feedback } from "./Feedback.js";

type C<T, Code> =
  | {
      ok: true;
      data: T;
      reason?: undefined;
    }
  | {
      ok: false;
      code: Code;
      reason: string;
      details?: unknown;
      data?: undefined;
    };

export const createFeedback = <T, Code extends string>(
  args: C<T, Code>,
): Feedback<T, Code> => {
  if (!args.ok) {
    return {
      id: uuid(),
      ok: false,
      code: args.code,
      reason: args.reason,
      details: args.details,
    };
  } else {
    return {
      id: uuid(),
      ok: true,
      data: args.data,
    };
  }
};
