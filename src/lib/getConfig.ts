import { join } from "path";
import { z } from "zod";

const TASKS_DIR = join(process.cwd(), "data/training");

const IMAGES_DIR = join(process.cwd(), "data/images");

const OPENAI_API_KEY = z.string().parse(process.env.OPENAI_API_KEY);

export const getConfig = () => {
  return { TASKS_DIR, IMAGES_DIR, OPENAI_API_KEY };
};
