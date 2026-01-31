import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry for refresh endpoint or if already retrying
    const isRefreshRequest = originalRequest?.url?.includes('/auth/jwt/refresh');
    const isLoginRequest = originalRequest?.url?.includes('/auth/jwt/create');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/auth/jwt/refresh");
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user is not authenticated, just reject
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
