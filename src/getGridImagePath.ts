import * as Arc from "./Arc.js";
import { config } from "./config.js";
import { join } from "path";

export const getGridImagePath = (args: { grid: Arc.Grid }) => {
  return join(
    config.IMAGES_DIR,
    `${args.grid.url.id}-${args.grid.url.trainOrTest}-${args.grid.url.n}-${args.grid.url.inputOrOutput}.png`,
  );
};
