export type Expression =
  | DefinitionExpression
  | CompoundExpression
  | PositionalExpression
  | FunctionCallExpression
  | FunctionDefinitionExpression
  | LiteralExpression
  | UnaryExpression
  | BinaryExpression;

export type DefinitionExpression = {
  type: "DEFINITION";
  parent: Expression | null;
  keyword: string;
  identifier: string;
  value: Expression;
};

export type CompoundExpression = {
  type: "COMPOUND";
  parent: Expression | null;
  keyword: string;
  components: Record<string, Expression>;
};

export type PositionalExpression = {
  type: "POSITIONAL";
  keyword: string;
  parent: Expression | null;
  arguments: Expression[];
};

export type FunctionCallExpression = {
  type: "FUNCTION_CALL";
  parent: Expression | null;
  reference: string;
  arguments: Record<string, Expression>;
};

export type FunctionDefinitionExpression = {
  type: "FUNCTION_DEFINITION";
  parent: Expression | null;
  /* TODO */
  signature: null;
  body: Expression;
};

export type LiteralExpression = {
  type: "LITERAL";
  parent: Expression | null;
  literal: string;
};

export type IdentifierExpression = {
  type: "IDENTIFIER";
  parent: Expression | null;
  identifier: string;
};

export type UnaryExpression = {
  type: "UNARY";
  parent: Expression | null;
  operator: string;
  operand: UnaryExpression | BinaryExpression;
};

export type BinaryExpression = {
  type: "BINARY";
  parent: Expression | null;
  operator: string;
  left: UnaryExpression | BinaryExpression;
  right: UnaryExpression | BinaryExpression;
};
