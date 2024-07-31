import { Exception } from "../types/Exception.js";

export const isException = (value: unknown): value is Exception => {
  try {
    return (value as { type: "EXCEPTION" }).type === "EXCEPTION";
  } catch {
    return false;
  }
};
