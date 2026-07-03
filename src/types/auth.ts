export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: string;
  roles: string[];
  status: string;
  isVerified: boolean;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}