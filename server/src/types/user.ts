export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExp?: Date | null;
  username: string;
  fullName?: string | null;
  isAdmin: boolean;
  createdAt: Date;
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