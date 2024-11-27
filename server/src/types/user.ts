export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: string | null;
  image?: string | null;
  password?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExp?: string | null;
  username: string;
  fullName?: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  isAdmin?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  fullName?: string;
  isAdmin?: boolean;
} 