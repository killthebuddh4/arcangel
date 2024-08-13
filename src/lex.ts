import { readFile } from "fs/promises";
import { getLexemes } from "./lang/getLexemes.js";

const SOURCE_FILE = "./data/test.arc";

const main = async () => {
  try {
    console.log("Reading source file...");
    const source = await readFile(SOURCE_FILE, "utf8");

    console.log("Lexing source...");
    const lexemes = getLexemes({ source: { text: source } });

    console.log("Lexemes:");
    console.log(JSON.stringify(lexemes, null, 2));
  } catch (error) {
    console.error(error);
  }
};

main();
