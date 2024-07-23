import { ParseResult } from "./ParseResult.js";
import * as Arc from "./Arc.js";

export const parseGridUrl = (args: {
  url: string;
}): ParseResult<Arc.Grid["url"]> => {
  const segments = args.url.split("-");

  if (segments.length !== 4) {
    return {
      ok: false,
      reason: `URL must have exactly three dashes, id-(train|test)-(input|output)-n, got ${args.url}`,
    };
  }

  const id = segments[0];

  if (id.length === 0) {
    return {
      ok: false,
      reason: "ID must have at least one character",
    };
  }

  const trainOrTest = segments[1];

  if (trainOrTest !== "train" && trainOrTest !== "test") {
    return {
      ok: false,
      reason: `Second segment must be 'train' or 'test', got ${trainOrTest}`,
    };
  }

  const n = parseInt(segments[2]);

  if (!Number.isInteger(n)) {
    return {
      ok: false,
      reason: `Third segment must be an integer, got ${segments[2]}`,
    };
  }

  const inputOrOutput = segments[3];

  if (inputOrOutput !== "input" && inputOrOutput !== "output") {
    return {
      ok: false,
      reason: `Fourth segment must be 'input' or 'output', got ${inputOrOutput}`,
    };
  }

  return {
    ok: true,
    data: { id, trainOrTest, n, inputOrOutput },
  };
};
