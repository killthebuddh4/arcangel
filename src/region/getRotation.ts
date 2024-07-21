import * as Arc from "../Arc.js";

export type Rotation = {
  degrees: 90 | 180 | 270 | -90 | -180 | -270;
};

export const getRotation = (args: {
  field: Arc.Field;
  region: Arc.Point[];
  degrees: number;
}) => {
  switch (args.degrees) {
    case 90:
    case -270:
      return rotate90({ region: args.region });
    case 180:
    case -180:
      return rotate180({ region: args.region });
    case 270:
    case -90:
      return rotate270({ region: args.region });
    default:
      throw new Error(
        `Invalid degrees: ${args.degrees}, must be +-90, +-180, or +-270`,
      );
  }
};

const rotate90 = (args: { region: Arc.Point[] }) => {
  const minX = Math.min(...args.region.map((point) => point.x));
  const maxX = Math.max(...args.region.map((point) => point.x));
  const maxY = Math.max(...args.region.map((point) => point.y));

  return args.region.map((point) => {
    console.log("minX", minX);
    console.log("maxX", maxX);
    console.log("maxY", maxY);
    console.log("maxX - (maxY - point.y)", maxX - (maxY - point.y));
    console.log("maxY + (point.x - minX)", maxY + (point.x - minX));

    return {
      x: maxX - (maxY - point.y),
      y: maxY - (point.x - minX),
      z: point.z,
    };
  });
};

const rotate180 = (args: { region: Arc.Point[] }) => {
  const minX = Math.min(...args.region.map((point) => point.x));
  const minY = Math.min(...args.region.map((point) => point.y));
  const maxX = Math.max(...args.region.map((point) => point.x));
  const maxY = Math.max(...args.region.map((point) => point.y));

  return args.region.map((point) => {
    return {
      x: maxX - (point.x - minX),
      y: maxY - (point.y - minY),
      z: point.z,
    };
  });
};

const rotate270 = (args: { region: Arc.Point[] }) => {
  const minX = Math.min(...args.region.map((point) => point.x));
  const maxY = Math.max(...args.region.map((point) => point.y));

  return args.region.map((point) => {
    return {
      x: minX + (point.y - maxY),
      y: maxY - (point.x - minX),
      z: point.z,
    };
  });
};
