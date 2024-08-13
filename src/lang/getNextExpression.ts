import { Expression } from "./Expression.js";
import { Lexeme } from "./Lexeme.js";
import { parseDefinition } from "./parseDefinition.js";
import { parseCompound } from "./parseCompound.js";
import { parsePositional } from "./parsePositional.js";
import { parseFunctionCall } from "./parseFunctionCall.js";
import { parseFunctionDefinition } from "./parseFunctionDefinition.js";
import { parseUnary } from "./parseUnary.js";
import { parseBinary } from "./parseBinary.js";
import { parseLiteral } from "./parseLiteral.js";
import { parseIdentifier } from "./parseIdentifier.js";

export const getNextExpression = (args: {
  index: number;
  lexemes: Lexeme[];
}): Expression => {
  // TODO
  const lexeme = args.lexemes[args.index];

  switch (lexeme.type) {
    /* ************************************************************************
     *
     * WHITESPACE
     *
     * ***********************************************************************/
    case "EOF":
    case "NEWLINE":
    case "WHITESPACE":
    case "COMMENT":
    /* ************************************************************************
     *
     * BINARY
     *
     * ***********************************************************************/
    case "MINUS":
    case "PLUS":
    case "STAR":
    case "SLASH":
    case "EQUAL":
    case "EQUAL_EQUAL":
    case "BANG_EQUAL":
    case "LESS":
    case "LESS_EQUAL":
    case "GREATER":
    case "GREATER_EQUAL":
      return parseBinary() as unknown as Expression;
    /* ************************************************************************
     *
     * UNARY
     *
     * ***********************************************************************/
    case "BANG":
      return parseUnary() as unknown as Expression;
    /* ************************************************************************
     *
     * FUNCTION DEFINITION
     *
     * ***********************************************************************/
    case "LEFT_PAREN":
      return parseFunctionDefinition() as unknown as Expression;
    case "RIGHT_PAREN":
    case "COLON":
    case "COMMA":
      throw new Error(
        `Should never encounter a ${lexeme.type} here, should be handled by parseFunctionDefinition`,
      );
    /* ************************************************************************
     *
     * FUNCTION CALL
     *
     * ***********************************************************************/
    case "@":
      return parseFunctionCall() as unknown as Expression;
    /* ************************************************************************
     *
     * FUNCTION DEFINITION
     *
     * ***********************************************************************/
    case "STRING":
    case "NUMBER":
    case "TRUE":
    case "FALSE":
    case "NULL":
    case "HASH":
    case "ARRAY":
    case "VOID":
      return parseLiteral() as unknown as Expression;
    /* ************************************************************************
     *
     * IDENTIFIER
     *
     * ***********************************************************************/
    case "IDENTIFIER":
      return parseIdentifier() as unknown as Expression;
    /* ************************************************************************
     *
     * COMPOUND KEYWORDS
     *
     * ***********************************************************************/
    case "IF":
    case "WHEN":
      return parseCompound() as unknown as Expression;
    case "THEN":
    case "ELSE":
      throw new Error(
        `Should never encounter a ${lexeme.type} here, it should be handled by parseCompound`,
      );
    case "DEF":
    case "LET":
      return parseDefinition() as unknown as Expression;
    /* ************************************************************************
     *
     * POSITIONAL KEYWORDS
     *
     * ***********************************************************************/
    case "DO":
    case "SET":
    case "GET":
    case "RETURN":
    case "FOR":
    case "MAP":
    case "FILTER":
    case "REDUCE":
    case "FIND":
    case "PUSH":
    case "POP":
    case "SHIFT":
    case "UNSHIFT":
    case "SOME":
    case "EVERY":
    case "KEYS":
    case "VALUES":
    case "SWITCH":
      return parsePositional() as unknown as Expression;
    case "END":
      throw new Error(
        `Should never encounter a ${lexeme.type} here, it should be handled by other parsers`,
      );
  }
};
