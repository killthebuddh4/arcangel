import { v4 as uuidv4 } from "uuid";
import { Canvas } from "./Canvas.js";

export const createCanvas = (): Canvas => {
  return {
    id: uuidv4(),
    points: [],
  };
};
