import * as Arc from "../Arc.js";

export const boundary = (args: { grid: Arc.Grid; x: number; y: number }) => {
  if (args.x < 0) {
    throw new Error(
      `X must be greater than or equal to 0. Received: ${args.x}`,
    );
  }

  if (args.x >= args.grid[0].length) {
    throw new Error(
      `X must be less than ${args.grid[0].length}. Received: ${args.x}`,
    );
  }

  if (args.y < 0) {
    throw new Error(
      `Y must be greater than or equal to 0. Received: ${args.y}`,
    );
  }

  if (args.y >= args.grid.length) {
    throw new Error(
      `Y must be less than ${args.grid.length}. Received: ${args.y}`,
    );
  }

  const color = args.grid[args.y][args.x];
};

function findBoundary(grid: Arc.Grid, x: number, y: number): Set<string> {
  const rows = grid.length;
  const cols = grid[0].length;
  const value = grid[x][y];
  const visited = new Set<string>();
  const boundary = new Set<string>();

  function dfs(x: number, y: number) {
    const key = `${x},${y}`;

    if (visited.has(key)) return;

    if (x < 0 || x >= rows || y < 0 || y >= cols || grid[x][y] !== value)
      return;

    visited.add(key);

    // Visit all adjacent cells
    dfs(x + 1, y);
    dfs(x - 1, y);
    dfs(x, y + 1);
    dfs(x, y - 1);
  }

  function isBoundary(x: number, y: number): boolean {
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    return neighbors.some(([nx, ny]) => {
      return (
        nx < 0 || nx >= rows || ny < 0 || ny >= cols || grid[nx][ny] !== value
      );
    });
  }

  dfs(x, y);

  visited.forEach((key) => {
    const [cx, cy] = key.split(",").map(Number);
    if (isBoundary(cx, cy)) {
      boundary.add(key);
    }
  });

  return boundary;
}
