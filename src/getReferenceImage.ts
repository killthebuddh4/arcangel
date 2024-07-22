import * as Arc from "./Arc.js";
import Jimp from "jimp";
import { getRgb } from "./getRgb.js";

export const getReferenceImage = async () => {
  const image = new Jimp(512, 512, "white");

  for (let y = 0; y < 320; y = y + 32) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
    image.print(
      font,
      0,
      y,
      {
        text: String(Math.floor(y / 32)),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      32,
      32,
    );
  }

  for (let y = 0; y < 320; y = y + 32) {
    const value = Math.floor(y / 32) as Arc.Value;
    const color = getRgb({ value });
    image.scan(32, y, 320, 32, (x, y, idx) => {
      image.bitmap.data[idx + 0] = color[0];
      image.bitmap.data[idx + 1] = color[1];
      image.bitmap.data[idx + 2] = color[2];
      image.bitmap.data[idx + 3] = 255;
    });
  }

  await image.writeAsync("data/reference.png");

  const dataUrl = await image.getBase64Async(Jimp.MIME_PNG);

  return { dataUrl, image };
};
