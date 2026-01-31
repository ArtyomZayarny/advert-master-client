import { apiClient } from "./client";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  username: string;
  email: string;
  password: string;
  re_password: string;
  address?: string;
  upload_user?: File;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  phone?: string;
  address?: string;
  upload_user?: string;
  deals?: number;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/jwt/create",
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterData): Promise<void> => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("re_password", data.re_password);
    if (data.address) formData.append("address", data.address);
    if (data.upload_user) formData.append("upload_user", data.upload_user);

    await apiClient.post("/auth/users/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/users/me");
    return response.data;
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>(
      "/auth/jwt/refresh",
      { refresh }
    );
    return response.data;
  },

  resetPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/users/reset_password", { email });
  },

  confirmResetPassword: async (
    new_password: string,
    re_new_password: string,
    uid: string,
    token: string
  ): Promise<void> => {
    await apiClient.post("/auth/users/reset_password_confirm", {
      new_password,
      re_new_password,
      uid,
      token,
    });
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/jwt/logout");
  },
};
