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
  full_name?: string | null;
  is_admin: boolean;
  created_at: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  is_admin?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  full_name?: string;
  is_admin?: boolean;
} 