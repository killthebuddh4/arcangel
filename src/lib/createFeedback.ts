import { v4 as uuid } from "uuid";
import { Feedback } from "../types/Feedback.js";

export const createFeedback = <T>(args: Args<T>): Feedback<T> => {
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

type Args<T> =
  | {
      ok: true;
      data: T;
      reason?: undefined;
    }
  | {
      ok: false;
      code: string;
      reason: string;
      details?: unknown;
      data?: undefined;
    };
