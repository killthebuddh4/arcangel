import { z } from "zod";
import { createMaybe } from "./createMaybe.js";
import { Maybe } from "../types/Maybe.js";
import { readFile } from "fs/promises";
import { join } from "path";
import { getConfig } from "./getConfig.js";
import { Task } from "../types/Task.js";

export const readTask = async (args: { id: string }): Promise<Maybe<Task>> => {
  let content: string;
  try {
    const filename = `${args.id}.json`;
    content = await readFile(join(getConfig().TASKS_DIR, filename), "utf-8");
  } catch {
    return createMaybe({
      ok: false,
      code: "FILE_READ_ERROR",
      reason: `Failed to read task from disk for task id: ${args.id}`,
    });
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return createMaybe({
      ok: false,
      code: "INVALID_JSON",
      reason: `Task with id ${args.id} is not a valid JSON file`,
    });
  }

  const task = z
    .object({
      train: z.array(
        z.object({
          input: z.array(z.array(z.number())),
          output: z.array(z.array(z.number())),
        }),
      ),
      test: z.array(
        z.object({
          input: z.array(z.array(z.number())),
          output: z.array(z.array(z.number())),
        }),
      ),
    })
    .safeParse(json);

  if (!task.success) {
    return createMaybe({
      ok: false,
      code: "SCHEMA_MISMATCH",
      reason: `Task with id ${args.id} does not match the expected schema`,
    });
  }

  return createMaybe({
    ok: true,
    data: task.data,
  });
};
