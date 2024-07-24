export const getRgb = (args: {
  color:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "brown"
    | "gray"
    | "black";
}): [number, number, number] => {
  switch (args.color) {
    case "red":
      return [255, 0, 0];
    case "orange":
      return [255, 165, 0];
    case "yellow":
      return [255, 255, 0];
    case "green":
      return [0, 255, 0];
    case "blue":
      return [0, 0, 255];
    case "purple":
      return [128, 0, 128];
    case "pink":
      return [255, 192, 203];
    case "brown":
      return [165, 42, 42];
    case "gray":
      return [128, 128, 128];
    case "black":
      return [0, 0, 0];
    default:
      throw new Error(`Invalid color: ${args.color}`);
  }
};
