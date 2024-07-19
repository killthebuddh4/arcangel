import { z } from "zod";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const zGrid = z.array(z.array(z.number().min(0).max(9)));

const zTask = z.object({
  train: z.array(
    z.object({
      input: zGrid,
      output: zGrid,
    }),
  ),
  test: z.array(
    z.object({
      input: zGrid,
      output: zGrid,
    }),
  ),
});

// every task in in a file in ./training/*.json, I want to read all of them and merge
// them into a single object where each key is the file name (without the .json)

const trainingDir = join(process.cwd(), "data/training");

const main = async () => {
  const files = await readdir(trainingDir);

  const tasks = await Promise.all(
    files.map(async (filename) => {
      const content = await readFile(join(trainingDir, filename), "utf-8");
      const json = zTask.safeParse(JSON.parse(content));

      if (!json.success) {
        console.error(filename, JSON.stringify(json.error, null, 2));
        throw new Error("Invalid Task");
      }

      return {
        key: filename.replace(".json", ""),
        task: json.data,
      };
    }),
  );

  const merged = tasks.reduce(
    (acc, { key, task }) => {
      acc[key] = task;
      return acc;
    },
    {} as Record<string, z.infer<typeof zTask>>,
  );

  console.log(JSON.stringify(merged, null, 2));
};

main();
