import { join } from "path";
import { z } from "zod";

const TASKS_DIR = join(process.cwd(), "data/training");

const IMAGES_DIR = join(process.cwd(), "data/images");

const OPENAI_API_KEY = z.string().parse(process.env.OPENAI_API_KEY);

const ANTHROPIC_API_KEY = z.string().parse(process.env.ANTHROPIC_API_KEY);

const EXPERIMENT_ID = z.string().parse(process.env.EXPERIMENT_ID);

export const getConfig = () => {
  return {
    TASKS_DIR,
    IMAGES_DIR,
    OPENAI_API_KEY,
    EXPERIMENT_ID,
    ANTHROPIC_API_KEY,
  };
};
