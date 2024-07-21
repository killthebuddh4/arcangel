import * as Arc from "../Arc.js";

export const create = (args: { task: Arc.Task }) => {
  return {
    task: args.task,
    history: {
      transitions: [],
      states: [],
    },
  };
};
