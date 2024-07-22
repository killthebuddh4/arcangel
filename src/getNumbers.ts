import { getGridUrl } from "./getGridUrl.js";
import { getTask } from "./getTask.js";

export const getNumbers = async (args: { url: string }) => {
  const url = getGridUrl({ url: args.url });
  const task = (await getTask({ id: url.id })) as {
    [key: string]: {
      [key: string]: number[][];
    }[];
  };

  return task[url.trainOrTest][url.n][url.inputOrOutput];
};
