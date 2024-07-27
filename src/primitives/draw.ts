import { Field } from "../field/Field.js";
import { Feedback } from "../feedback/Feedback.js";
import { write } from "../field/write.js";
import { Point } from "../field/Point.js";
import { clone } from "../field/clone.js";
import { createFeedback } from "../feedback/createFeedback.js";

export const draw = (args: {
  field: Field;
  points: Point[];
}): Feedback<Field> => {
  const cloned = clone({ field: args.field });

  for (const point of args.points) {
    const result = write({
      field: cloned,
      x: point.x,
      y: point.y,
      value: point.value,
    });

    if (!result.ok) {
      // TODO Probably need to work the `reason` field here to make it more
      // clearly related to the draw function rather than a single write.
      throw new Error(`Failed to draw: ${result.reason}`);
    }
  }

  return createFeedback({
    ok: true,
    data: cloned,
  });
};
