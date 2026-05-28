import { apiRequest } from "./api";
import { authService } from "./auth.service";

export interface UserRole {
  id: number;
  name: string;
  description?: string | null;
}

export interface CurrentUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  is_active: boolean;
  email_verified: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  role?: UserRole | null;
}

export interface User {
  id: number;
  role_id?: number;
  full_name: string;
  email: string;
  phone?: string | null;
  is_active: boolean;
  email_verified: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  role?: UserRole | null;
}

export interface CreateUserPayload {
  role_id: number;
  full_name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface UpdateUserPayload {
  role_id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export async function getCurrentUser(token: string): Promise<CurrentUser> {
  return apiRequest<CurrentUser>("/users/me", {
    method: "GET",
    token,
  });
}

export async function updateCurrentUserProfile(
  token: string,
  payload: UpdateProfilePayload
): Promise<CurrentUser> {
  return apiRequest<CurrentUser>("/users/me", {
    method: "PUT",
    token,
    body: payload,
  });
}

export const userService = {
  async getAll(): Promise<User[]> {
    return apiRequest<User[]>("/users/", {
      method: "GET",
      token: authService.getToken(),
    });
  },

  async create(payload: CreateUserPayload): Promise<User> {
    return apiRequest<User>("/users/", {
      method: "POST",
      body: payload,
      token: authService.getToken(),
    });
  },

  async getById(userId: number): Promise<User> {
    return apiRequest<User>(`/users/${userId}`, {
      method: "GET",
      token: authService.getToken(),
    });
  },

  async update(userId: number, payload: UpdateUserPayload): Promise<User> {
    return apiRequest<User>(`/users/${userId}`, {
      method: "PUT",
      body: payload,
      token: authService.getToken(),
    });
  },

  async deactivate(userId: number): Promise<void> {
    return apiRequest<void>(`/users/${userId}`, {
      method: "DELETE",
      token: authService.getToken(),
    });
  },
};