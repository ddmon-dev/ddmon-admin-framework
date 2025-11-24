export type ActionResult<T> =
  | { success: true; data: T; error?: string }
  | { success: false; error: string; data?: T };

export type ActionResultWithDetailError<T> =
  | { success: true; data: T; error?: ActionError }
  | { success: false; error: ActionError; data?: T };

export type ActionError = {
  message: string;
  path?: string;
};
