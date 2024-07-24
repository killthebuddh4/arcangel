import { Node } from "./Node.js";

export type Edge = {
  id: string;
  upstream: Node;
  downstream: Node;
  operation: string;
};
