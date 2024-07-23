import { generateNumbers } from "./generateNumbers.js";

const numbers = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0],
  [0, 3, 0, 3, 0, 0],
  [0, 0, 3, 0, 3, 0],
  [0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

const streamId = `arcangel-test-${Date.now().toLocaleString()}`;
const main = async () => {
  await generateNumbers({ streamId, numbers });
};

main();
