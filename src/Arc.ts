export type Grid = number[][];

export type Example = {
  input: Grid;
  output: Grid;
};

export type Task = {
  train: Example[];
  test: Example[];
};

export type Arc = {
  [key: string]: Task;
};

export type Field = {
  points: Point[];
  dimensions: {
    x: number;
    y: number;
  };
};

export type Point = {
  x: number;
  y: number;
  z: number | null;
};

export type Transition = {
  upstream: Node;
  downstream: Node;
  operation: string;
  thoughts: string | null;
};

export type State = {
  upstream: Transition | null;
  downstream: Transition[];
  thoughts: string | null;
  field: Field;
};

export type History = {
  transitions: Transition[];
  states: State[];
};

export type Log = {
  task: Task;
  history: History;
};
