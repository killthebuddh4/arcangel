export type Feedback<T> =
  | {
      ok: true;
      id: string;
      data: T;
      reason?: undefined;
    }
  | {
      ok: false;
      id: string;
      reason: string;
      details?: unknown;
      data?: undefined;
    };
