import { z } from "zod";
import { readFile } from "fs/promises";
import { join } from "path";
import { config } from "../config.js";
import { Maybe } from "../Maybe.js";
import { taskSchema } from "./taskSchema.js";

export const getTask = async (args: {
  id: string;
}): Promise<Maybe<z.infer<typeof taskSchema>>> => {
  let content: string;
  try {
    const filename = `${args.id}.json`;
    content = await readFile(join(config.TASKS_DIR, filename), "utf-8");
  } catch {
    return {
      ok: false,
      reason: `Failed to read task from disk for task id: ${args.id}`,
    };
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return {
      ok: false,
      reason: `Task with id ${args.id} is not a valid JSON file`,
    };
  }

  const task = taskSchema.safeParse(json);

  if (!task.success) {
    return {
      ok: false,
      reason: `Task with id ${args.id} does not match the expected schema`,
    };
  }

  return {
    ok: true,
    data: task.data,
  };
};
