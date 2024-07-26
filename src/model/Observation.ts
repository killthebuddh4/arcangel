export type Observation =
  | {
      isPositive: true;
      notes?: string;
    }
  | {
      isPositive: false;
      notes: string;
    };
