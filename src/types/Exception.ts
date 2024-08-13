export type Exception = {
  type: "EXCEPTION";
  id: string;
  code: string;
  reason: string | Exception;
  error?: Error;
};
