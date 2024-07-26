import { Value } from "./Value.js";

export const compareValues = (args: { a: Value; b: Value }): boolean => {
  return (
    args.a[0] === args.b[0] &&
    args.a[1] === args.b[1] &&
    args.a[2] === args.b[2]
  );
};
