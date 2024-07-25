import { Predicate } from "./Predicate.js";

export type Fact = {
  predicate: Predicate;
  data: boolean;
};
