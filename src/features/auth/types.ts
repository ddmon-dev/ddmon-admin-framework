export type SignInValues = {
  id: string;
  password: string;
};

export type SignInResult = {
  success: boolean;
  error?: string;
};
