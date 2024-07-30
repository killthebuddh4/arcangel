export type Observation =
  | {
      id: string;
      isPositive: true;
    }
  | {
      id: string;
      isPositive: false;
      code: string;
      reason: string;
      details?: unknown;
    };
