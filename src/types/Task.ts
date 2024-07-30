export type Task = {
  train: {
    input: number[][];
    output: number[][];
  }[];
  test: {
    input: number[][];
    output: number[][];
  }[];
};
