import { readFile } from "fs/promises";
import { join } from "path";
import { config } from "./config.js";
import { zTask } from "./zTask.js";

export const getTask = async (args: { id: string }) => {
  const filename = `${args.id}.json`;
  const content = await readFile(join(config.TASKS_DIR, filename), "utf-8");

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch (e) {
    throw new Error(`Task ${args.id} is not valid JSON`);
  }

  const task = zTask.safeParse(json);

  if (!task.success) {
    throw new Error(`Task ${args.id} does not match zTask schema`);
  }

  return task.data;
};
