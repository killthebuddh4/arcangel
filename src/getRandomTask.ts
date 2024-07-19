import * as Arc from "./Arc.js";

export const getRandomTask = (data: Arc.Arc) => {
  const taskIds = Object.keys(data);
  const randomTaskId = taskIds[Math.floor(Math.random() * taskIds.length)];
  return { id: randomTaskId, task: data[randomTaskId] };
};
