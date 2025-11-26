export type ActionResult<T> =
  | { success: true; data: T; error?: string }
  | { success: false; error: string; data?: T };

// 이렇게 사용하는것도 고려? 아직 이건 미사용중임.
export type ActionResultWithDetailError<T> =
  | { success: true; data: T; error?: ActionError }
  | { success: false; error: ActionError; data?: T };

export type ActionError = {
  message: string;
  path?: string;
};
