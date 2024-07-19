export type Cell = number;

export type Grid = Cell[][];

export type Example = {
  input: Grid;
  output: Grid;
};

export type Problem = {
  examples: Example[];
  input: Grid;
};

export type Solution = {
  problem: Problem;
  output: Grid;
};

export type TrainingTask = {
  train: Example[];
  test: Example[];
};

export type Arc = {
  [key: string]: TrainingTask;
};
