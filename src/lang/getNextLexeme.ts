import { getCharacter } from "./getNextCharacter.js";
import { createException } from "../lib/createException.js";
import { Source } from "./Source.js";
import { Lexeme } from "./Lexeme.js";
import { isIdentifierCharacter } from "./isIdentifierCharacter.js";

export const getNextLexeme = (args: {
  source: Source;
  start: number;
  line: number;
}): Lexeme => {
  console.log(`getNextLexeme :: start is ${args.start}`);
  if (args.start >= args.source.text.length) {
    return {
      type: "EOF",
      text: "",
      start: args.start,
      length: 0,
      line: args.line,
    };
  }

  let current = args.start;

  const createLexeme = (type: Lexeme["type"], length: number): Lexeme => {
    current = current + length;

    return {
      type,
      text: args.source.text.substring(args.start, current),
      start: args.start,
      length: current - args.start,
      line: args.line,
    };
  };

  const isAtEndOfSource = (index: number) => {
    return index >= args.source.text.length;
  };

  const char = getCharacter({
    source: args.source,
    index: args.start,
  });

  console.log(`getNextLexeme :: char is ${char}`);

  switch (char) {
    /* ***********************************************************************
     *
     * WHITESPACE
     *
     * **********************************************************************/
    case "\n":
      return createLexeme("NEWLINE", 1);
    case "\r":
    case "\t":
    case " ":
      return createLexeme("WHITESPACE", 1);
    /* ***********************************************************************
     *
     * COMMENTS
     *
     * **********************************************************************/
    case "#":
      let length = 0;
      while (true) {
        length++;

        if (isAtEndOfSource(current + length)) {
          return createLexeme("COMMENT", length);
        }

        const nextChar = getCharacter({
          source: args.source,
          index: current + length,
        });

        if (nextChar === "\n") {
          return createLexeme("COMMENT", length);
        }
      }
    /* ***********************************************************************
     *
     * SINGLE CHARACTER TOKENS
     *
     * **********************************************************************/
    case "@":
      return createLexeme("@", 1);
    case "-":
      return createLexeme("MINUS", 1);
    case "+":
      return createLexeme("PLUS", 1);
    case "*":
      return createLexeme("STAR", 1);
    case "/":
      return createLexeme("SLASH", 1);
    case "(":
      return createLexeme("LEFT_PAREN", 1);
    case ")":
      return createLexeme("RIGHT_PAREN", 1);
    case ":":
      return createLexeme("COLON", 1);
    case ",":
      return createLexeme("COMMA", 1);
    /* ***********************************************************************
     *
     * 2 CHARACTER TOKENS
     *
     * **********************************************************************/
    case "!": {
      const nextChar = getCharacter({
        source: args.source,
        index: current + 1,
      });

      if (nextChar === "=") {
        return createLexeme("BANG_EQUAL", 2);
      } else {
        return createLexeme("BANG", 1);
      }
    }
    case "<": {
      const nextChar = getCharacter({
        source: args.source,
        index: current + 1,
      });

      if (nextChar === "=") {
        return createLexeme("LESS_EQUAL", 2);
      } else {
        return createLexeme("LESS", 1);
      }
    }
    case ">": {
      const nextChar = getCharacter({
        source: args.source,
        index: current + 1,
      });

      if (nextChar === "=") {
        return createLexeme("GREATER_EQUAL", 2);
      } else {
        return createLexeme("GREATER", 1);
      }
    }
    /* ***********************************************************************
     *
     * 3 CHARACTER TOKENS
     *
     * **********************************************************************/
    case "=": {
      const nextChar = getCharacter({
        source: args.source,
        index: current + 1,
      });

      if (nextChar != "=") {
        return createLexeme("EQUAL", 1);
      } else {
        return createLexeme("EQUAL_EQUAL", 2);
      }
    }
    /* ***********************************************************************
     *
     * STRINGS
     *
     * **********************************************************************/
    case "`": {
      let length = 0;
      while (true) {
        length++;

        if (isAtEndOfSource(current + length)) {
          throw createException({
            code: "LEXER_UNTERMINATED_STRING",
            reason: `Unterminated string at index: ${current}`,
          });
        }

        const nextChar = getCharacter({
          source: args.source,
          index: current + length,
        });

        if (nextChar === "`") {
          return createLexeme("STRING", length + 1);
        }
      }
    }
    /* ***********************************************************************
     *
     * NUMBERS
     *
     * **********************************************************************/
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9": {
      console.log(`getNextLexeme :: starting number lexeme`);

      let length = 0;
      while (true) {
        length++;

        if (isAtEndOfSource(current + length)) {
          return createLexeme("NUMBER", length);
        }

        const nextChar = getCharacter({
          source: args.source,
          index: current + length,
        });

        console.log(`getNextLexeme :: number :: nextChar is ${nextChar}`);

        const isNextCharPartOfNumber = (() => {
          switch (nextChar) {
            case ".":
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              return true;
            default:
              return false;
          }
        })();

        if (!isNextCharPartOfNumber) {
          return createLexeme("NUMBER", length);
        }
      }
    }
    /* ***********************************************************************
     *
     * LITERALS
     *
     * **********************************************************************/
    case "{": {
      const length = 2;
      const text = args.source.text.substring(current, current + length);

      if (text === "{}") {
        return createLexeme("HASH", length);
      } else {
        throw createException({
          code: "LEXER_UNEXPECTED_CHARACTER",
          reason: `Expected "}" after "{" at index: ${current}`,
        });
      }
    }
    case "[": {
      const length = 2;
      const text = args.source.text.substring(current, current + length);

      if (text === "[]") {
        return createLexeme("ARRAY", length);
      } else {
        throw createException({
          code: "LEXER_UNEXPECTED_CHARACTER",
          reason: `Expected "]" after "[" at index: ${current}`,
        });
      }
    }
    case "t": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "true") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("TRUE", length);
        }
      }
      // NOTE THE FALLTHROUGH
    }
    case "f": {
      const length = 5;
      const text = args.source.text.substring(current, current + length);

      if (text === "false") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("FALSE", length);
        }
      }
      // NOTE THE FALLTHROUGH
    }
    case "n": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "null") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("NULL", length);
        }
      }
      // NOTE THE FALLTHROUGH
    }
    case "v": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "void") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("VOID", length);
        }
      }
      // NOTE THE FALLTHROUGH
    }
    /* ***********************************************************************
     *
     * KEYWORDS
     *
     * **********************************************************************/
    case "i": {
      const length = 2;
      const text = args.source.text.substring(current, current + length);

      if (text === "if") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("IF", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "t": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "then") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("THEN", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "e": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "else") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("ELSE", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "d": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "def") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("DEF", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "l": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "let") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("LET", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "d": {
      const length = 2;
      const text = args.source.text.substring(current, current + length);

      if (text === "do") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("DO", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "e": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "end") {
        return createLexeme("END", length);
      }

      // NOTE THE FALLTHROUGH
    }
    case "s": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "set") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("SET", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "g": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "get") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("GET", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "r": {
      const length = 6;
      const text = args.source.text.substring(current, current + length);

      if (text === "return") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("RETURN", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "f": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "for") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("FOR", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "m": {
      const length = 3;
      const text = args.source.text.substring(current, current + length);

      if (text === "map") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("MAP", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "f": {
      const length = 6;
      const text = args.source.text.substring(current, current + length);

      if (text === "filter") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("FILTER", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "r": {
      const length = 6;
      const text = args.source.text.substring(current, current + length);

      if (text === "reduce") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("REDUCE", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "f": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "find") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("FIND", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "s": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "some") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("SOME", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "e": {
      const length = 5;
      const text = args.source.text.substring(current, current + length);

      if (text === "every") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("EVERY", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "k": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "keys") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("KEYS", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "v": {
      const length = 6;
      const text = args.source.text.substring(current, current + length);

      if (text === "values") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("VALUES", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "s": {
      const length = 6;
      const text = args.source.text.substring(current, current + length);

      if (text === "switch") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("SWITCH", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    case "w": {
      const length = 4;
      const text = args.source.text.substring(current, current + length);

      if (text === "when") {
        const nextChar = getCharacter({
          source: args.source,
          // TODO is this correct? or should it be current + length?
          index: current + length + 1,
        });

        if (
          !isIdentifierCharacter({
            char: nextChar,
          })
        ) {
          return createLexeme("WHEN", length);
        }
      }

      // NOTE THE FALLTHROUGH
    }
    /* ***********************************************************************
     *
     * IDENTIFIERS
     *
     * **********************************************************************/
    case "_":
    case "a":
    case "b":
    case "c":
    case "d":
    case "e":
    case "f":
    case "g":
    case "h":
    case "i":
    case "j":
    case "k":
    case "l":
    case "m":
    case "n":
    case "o":
    case "p":
    case "q":
    case "r":
    case "s":
    case "t":
    case "u":
    case "v":
    case "w":
    case "x":
    case "y":
    case "z": {
      let length = 0;

      while (true) {
        length++;

        if (isAtEndOfSource(current + length)) {
          return createLexeme("IDENTIFIER", length);
        }

        const nextChar = getCharacter({
          source: args.source,
          index: current + length,
        });

        const isNextCharPartOfIdentifier = (() => {
          switch (nextChar) {
            case "_":
            case "a":
            case "b":
            case "c":
            case "d":
            case "e":
            case "f":
            case "g":
            case "h":
            case "i":
            case "j":
            case "k":
            case "l":
            case "m":
            case "n":
            case "o":
            case "p":
            case "q":
            case "r":
            case "s":
            case "t":
            case "u":
            case "v":
            case "w":
            case "x":
            case "y":
            case "z":
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              return true;
            default:
              return false;
          }
        })();

        if (!isNextCharPartOfIdentifier) {
          return createLexeme("IDENTIFIER", length);
        }
      }
    }
    default:
      throw createException({
        code: "LEXER_UNEXPECTED_CHARACTER",
        reason: `Unexpected character: ${char} at index: ${current}`,
      });
  }
};
