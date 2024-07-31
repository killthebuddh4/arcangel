export type Maybe<T> =
  | {
      id: string;
      ok: true;
      data: T;
      reason?: undefined;
    }
  | {
      id: string;
      ok: false;
      code: string;
      // TODO We know the reason is always a failure, so the type in Maybe should
      // never matter, but is there a better way to type this?
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reason: string | Maybe<any>;
    };
