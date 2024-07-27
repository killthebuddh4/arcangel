export type Feedback<T, C extends string = string> =
  | {
      id: string;
      ok: true;
      data: T;
    }
  | {
      id: string;
      ok: false;
      code: C;
      reason: string;
      details?: unknown;
    };
