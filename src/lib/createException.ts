import { v4 as uuidv4 } from "uuid";
import { Exception } from "../types/Exception.js";

export const createException = (args: {
  code: string;
  reason: string | Exception;
  quiet?: boolean;
}): Exception => {
  if (!(args.quiet === false)) {
    console.error(new Error().stack);
  }

  return {
    type: "EXCEPTION",
    id: uuidv4(),
    code: args.code,
    reason: args.reason,
  };
};
