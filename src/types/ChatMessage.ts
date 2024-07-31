import { ChatSystemMessage } from "./ChatSystemMessage.js";
import { ChatTextMessage } from "./ChatTextMessage.js";
import { ChatAssistantMessage } from "./ChatAssistantMessage.js";
import { ChatImageMessage } from "./ChatImageMessage.js";
import { ChatToolResponseMessage } from "./ChatToolResponseMessage.js";
import { ChatToolCallMessage } from "./ChatToolCallMessage.js";

export type ChatMessage =
  | ChatSystemMessage
  | ChatTextMessage
  | ChatAssistantMessage
  | ChatImageMessage
  | ChatToolCallMessage
  | ChatToolResponseMessage;
