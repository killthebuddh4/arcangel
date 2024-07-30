import OpenAI from "openai";
import { getConfig } from "./getConfig.js";

const openai = new OpenAI({
  apiKey: getConfig().OPENAI_API_KEY,
});

export const getOpenAi = () => {
  return openai;
};
