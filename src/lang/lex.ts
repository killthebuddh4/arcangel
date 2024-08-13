import { Source } from "./Source.js";
import { getNextLexeme } from "./getNextLexeme.js";
import { Lexeme } from "./Lexeme.js";

export const lex = (args: { source: Source }) => {
  const STATE: { lexemes: Lexeme[]; current: number; line: number } = {
    lexemes: [],
    current: 0,
    line: 0,
  };

  let next = getNextLexeme({
    source: args.source,
    start: STATE.current,
    line: STATE.line,
  });

  while (next.type !== "EOF") {
    console.log(`got next lexeme: ${JSON.stringify(next, null, 2)}`);

    STATE.lexemes.push(next);
    STATE.current = next.start + next.length;

    if (next.type === "NEWLINE") {
      STATE.line = STATE.line + 1;
    }

    next = getNextLexeme({
      source: args.source,
      start: STATE.current,
      line: STATE.line,
    });
  }

  return STATE.lexemes;
};
