export type SignInValues = {
  id: string;
  password: string;
};

export type SignInResult = {
  success: boolean;
  error?: string;
};

export type UpdateProfileValues = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export type UpdateProfileResult = {
  success: boolean;
  error?: string;
};
