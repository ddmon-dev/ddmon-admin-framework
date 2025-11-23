export type AdminUser = {
  id: string;
  name: string;
  superAdmin: boolean;
};

export type AuthSession = {
  user: AdminUser;
};

export type SignInValues = {
  name: string;
  password: string;
};

export type SignInResult = {
  success: boolean;
  error?: string;
};
