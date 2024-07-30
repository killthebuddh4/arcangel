import { Feedback } from "../field/Feedback.js";

export type Handler<T, C extends string> = (
  generated: string,
) => Feedback<T, C>;
