import { Node } from "./Node.js";

export type Edge = {
  upstream: Node;
  downstream: Node;
  operation: string;
};
