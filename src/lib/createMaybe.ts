import { Maybe } from "../types/Maybe.js";
import { v4 as uuidv4 } from "uuid";

export const createMaybe = <T>(args: M<T>): Maybe<T> => {
  if (!args.ok) {
    return {
      id: uuidv4(),
      ok: false,
      code: args.code,
      reason: args.reason,
    };
  }

  return {
    id: uuidv4(),
    ok: true,
    data: args.data,
  };
};

type M<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      code: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reason: string | Maybe<any>;
      data?: undefined;
    };
