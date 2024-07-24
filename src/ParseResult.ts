export type ParseResult<T> =
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
