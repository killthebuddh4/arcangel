import * as Arc from "./Arc.js";
import { ParseResult } from "./ParseResult.js";
import { parseNumbers } from "./parseNumbers.js";

export const validateEncodedTool = (args: {
  original: number[][];
  generated: number[][];
}): ParseResult<Arc.Value[][]> => {
  const original = parseNumbers(args.original);

  if (!original.ok) {
    throw new Error(
      `Original numbers are invalid: ${original.reason}, but they came from the training data so this should never happen`,
    );
  }

  const generated = parseNumbers(args.generated);

  if (!generated.ok) {
    return generated;
  }

  const numColsInOriginal = original.data[0].length;
  const numColsInGenerated = generated.data[0].length;

  if (numColsInOriginal !== numColsInGenerated) {
    return {
      ok: false,
      reason: `Should have ${numColsInOriginal} columns, but has ${numColsInGenerated} columns`,
    };
  }

  const numRowsInOriginal = original.data.length;
  const numRowsInGenerated = generated.data.length;

  if (numRowsInOriginal !== numRowsInGenerated) {
    return {
      ok: false,
      reason: `Should have ${numRowsInOriginal} rows, but has ${numRowsInGenerated} rows`,
    };
  }

  return {
    ok: true,
    data: generated.data,
  };
};
