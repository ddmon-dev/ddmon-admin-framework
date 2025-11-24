export type AdminUser = {
  id: string;
  name: string;
  email: string;
  superAdmin: boolean;
};

export type AuthSession = {
  user: AdminUser;
};

export type SignInValues = {
  id: string;
  password: string;
};

export type SignInResult = {
  success: boolean;
  error?: string;
};
