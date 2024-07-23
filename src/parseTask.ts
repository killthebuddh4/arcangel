import { z } from "zod";
import { zTask } from "./zTask.js";
import { ParseResult } from "./ParseResult.js";

export const parseTask = (data: string): ParseResult<z.infer<typeof zTask>> => {
  let json: unknown;
  try {
    json = JSON.parse(data);
  } catch {
    return {
      ok: false,
      reason: `Input data is not valid JSON`,
    };
  }

  const task = zTask.safeParse(json);

  if (!task.success) {
    return {
      ok: false,
      reason: `Input data does not match zTask schema`,
    };
  }

  return {
    ok: true,
    data: task.data,
  };
};
