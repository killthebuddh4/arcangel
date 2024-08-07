import { getConfig } from "./getConfig.js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: getConfig().ANTHROPIC_API_KEY,
});

export const getAnthropic = () => {
  return anthropic;
};
