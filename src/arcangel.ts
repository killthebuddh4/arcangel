import { genRule } from "./genRule.js";
import { getReferenceImage } from "./getReferenceImage.js";

const main = async () => {
  await getReferenceImage();
  await genRule();
};

main();
