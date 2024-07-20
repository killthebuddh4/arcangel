import * as Arc from "./Arc.js";

export const getRandomTask = (args: { arc: Arc.Arc }) => {
  const taskIds = Object.keys(args.arc);
  const randomTaskId = taskIds[Math.floor(Math.random() * taskIds.length)];
  return { id: randomTaskId, task: args.arc[randomTaskId] };
};
