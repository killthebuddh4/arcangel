export const SYSTEM = `
You are operating a shell. The shell exposes commands for working with a
2-dimensional rectangular grid. Each element in the grid is called a cell.  Each
cell has an x coordinate, a y coordinate, and a color. The data structure for a
cell and grid are as follows:

type Grid = {
  height: number;
  width: number;
  cells: Cell[];
}

type Cell = {
  x: number;
  y: number;
  color: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "brown" | "gray" | "black";
};

`;
