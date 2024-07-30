import { Maybe } from "../types/Maybe.js";
export const getMaybeString = (args: { maybe: Maybe<unknown> }): string => {
  if (args.maybe.ok) {
    throw new Error(`Stringify successful Maybe not implemented.`);
  }

  const maybes: Array<Maybe<unknown>> = [args.maybe];

  while (true) {
    const deepest = maybes[maybes.length - 1];

    if (deepest.ok) {
      throw new Error(`Stringify successful Maybe not implemented.`);
    }

    if (typeof deepest.reason === "string") {
      break;
    }

    maybes.push(deepest.reason);
  }

  let str = "";

  for (let i = maybes.length - 1; i >= 0; i--) {
    const maybe = maybes[i];

    if (maybe.ok) {
      throw new Error(`Stringify successful Maybe not implemented.`);
    }

    if (typeof maybe.reason === "string") {
      str += `CODE: ${maybe.code}\nREASON: ${maybe.reason}\n\n`;
    } else {
      str += `CODE: ${maybe.code}\n`;
    }
  }

  return str;
};
