import { v4 as uuid } from "uuid";
import { Feedback } from "./Feedback.js";

type C<T> =
  | {
      ok: true;
      data: T;
      reason?: undefined;
    }
  | {
      ok: false;
      reason: string;
      details?: unknown;
      data?: undefined;
    };

export const createFeedback = <T>(args: C<T>): Feedback<T> => {
  if (!args.ok) {
    return {
      id: uuid(),
      ok: false,
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
