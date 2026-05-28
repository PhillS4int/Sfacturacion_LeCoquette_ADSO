import { apiRequest } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    });

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};