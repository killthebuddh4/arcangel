import * as Arc from "./Arc.js";

export const getGridUrl = (args: { url: string }): Arc.Grid["url"] => {
  const segments = args.url.split("-");

  if (segments.length !== 4) {
    throw new Error(
      `URL must have exactly three dashes, id-(train|test)-(input|output)-n, got ${args.url}`,
    );
  }

  const id = segments[0];

  // TODO denser validation
  if (id.length === 0) {
    throw new Error("ID must have at least one character");
  }

  const trainOrTest = segments[1];

  if (trainOrTest !== "train" && trainOrTest !== "test") {
    throw new Error("Second segment must be 'train' or 'test'");
  }

  const n = parseInt(segments[2]);

  if (isNaN(n)) {
    throw new Error("Fourth segment must be an integer");
  }

  const inputOrOutput = segments[3];

  if (inputOrOutput !== "input" && inputOrOutput !== "output") {
    throw new Error("Third segment must be 'input' or 'output'");
  }

  return { id, trainOrTest, inputOrOutput, n };
};
