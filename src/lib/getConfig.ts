import { join } from "path";

export const getConfig = () => {
  return {
    TASKS_DIR: join(process.cwd(), "data/training"),
    IMAGES_DIR: join(process.cwd(), "data/images"),
  };
};
