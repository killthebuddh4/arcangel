import Jimp from "jimp";
import { getGridImage } from "./getGridImage.js";

type I = Awaited<ReturnType<typeof getGridImage>>;

export const writeTaskImage = async (args: {
  path: string;
  guess: string;
  inputs: I[];
  outputs: I[];
  testInputs: I[];
  testOutputs: I[];
}) => {
  const numRows = args.inputs.length + args.testInputs.length;
  const imgHeight = 512 * numRows + 20 * numRows + 600;
  const imgWidth = 20 + 512 * 2;

  const getOffsetsForInput = (i: number) => {
    return {
      x: 0,
      y: i * 512 + i * 20,
    };
  };

  const getOffsetsForOutput = (i: number) => {
    return {
      x: 512 + 20,
      y: i * 512 + i * 20,
    };
  };

  const getOffsetsForTestInput = (i: number) => {
    const base = args.inputs.length * 512 + args.inputs.length * 20;

    return {
      x: 0,
      y: base + i * 512 + i * 20,
    };
  };

  const getOffsetForTestOutput = (i: number) => {
    const base = args.inputs.length * 512 + args.inputs.length * 20;

    return {
      x: 512 + 20,
      y: base + i * 512 + i * 20,
    };
  };

  const image = new Jimp(imgWidth, imgHeight, "white");

  for (let i = 0; i < args.inputs.length; i++) {
    const offsets = getOffsetsForInput(i);
    const { image: input } = args.inputs[i];
    input.scan(0, 0, 512, 512, (x, y) => {
      image.setPixelColor(
        input.getPixelColor(x, y),
        offsets.x + x,
        offsets.y + y,
      );
    });
  }

  for (let i = 0; i < args.outputs.length; i++) {
    const offsets = getOffsetsForOutput(i);
    const { image: output } = args.outputs[i];
    output.scan(0, 0, 512, 512, (x, y) => {
      image.setPixelColor(
        output.getPixelColor(x, y),
        offsets.x + x,
        offsets.y + y,
      );
    });
  }

  for (let i = 0; i < args.testInputs.length; i++) {
    const offsets = getOffsetsForTestInput(i);
    const { image: test } = args.testInputs[i];
    test.scan(0, 0, 512, 512, (x, y) => {
      image.setPixelColor(
        test.getPixelColor(x, y),
        offsets.x + x,
        offsets.y + y,
      );
    });
  }

  for (let i = 0; i < args.testOutputs.length; i++) {
    const offsets = getOffsetForTestOutput(i);
    const { image: test } = args.testOutputs[i];
    test.scan(0, 0, 512, 512, (x, y) => {
      image.setPixelColor(
        test.getPixelColor(x, y),
        offsets.x + x,
        offsets.y + y,
      );
    });
  }

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  image.print(
    font,
    32,
    imgHeight - 632,
    {
      text: args.guess,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    imgWidth - 64,
    600,
  );

  image.write(`data/images/tasks/${args.path}`);
};
