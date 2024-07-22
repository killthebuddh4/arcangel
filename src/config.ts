import { join } from "path";

const TASKS_DIR = join(process.cwd(), "data/training");

const IMAGES_DIR = join(process.cwd(), "data/images");

export const config = {
  TASKS_DIR,
  IMAGES_DIR,
};
