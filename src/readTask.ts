import { z } from "zod";
import { readFile } from "fs/promises";
import { join } from "path";
import { config } from "./config.js";
import { Feedback } from "./types/Feedback.js";
import { taskSchema } from "./taskSchema.js";
import { createFeedback } from "./createFeedback.js";

type GetTaskFeedbackCode =
  | "FILE_READ_ERROR"
  | "INVALID_JSON"
  | "SCHEMA_MISMATCH";

export const getTask = async (args: {
  id: string;
}): Promise<Feedback<z.infer<typeof taskSchema>, GetTaskFeedbackCode>> => {
  let content: string;
  try {
    const filename = `${args.id}.json`;
    content = await readFile(join(config.TASKS_DIR, filename), "utf-8");
  } catch {
    return createFeedback({
      ok: false,
      code: "FILE_READ_ERROR",
      reason: `Failed to read task from disk for task id: ${args.id}`,
    });
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return createFeedback({
      ok: false,
      code: "INVALID_JSON",
      reason: `Task with id ${args.id} is not a valid JSON file`,
    });
  }

  const task = taskSchema.safeParse(json);

  if (!task.success) {
    return createFeedback({
      ok: false,
      code: "SCHEMA_MISMATCH",
      reason: `Task with id ${args.id} does not match the expected schema`,
    });
  }

  return createFeedback({
    ok: true,
    data: task.data,
  });
};
