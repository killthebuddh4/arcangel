export type Maybe<T> =
  | {
      ok: true;
      data: T;
      reason?: undefined;
    }
  | {
      ok: false;
      reason: string;
      data?: undefined;
    };
