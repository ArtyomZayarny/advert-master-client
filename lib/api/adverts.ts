import { apiClient } from "./client";

export interface Advert {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: "EUR" | "GBP" | "RUB";
  address: string;
  city: string;
  category: string;
  upload: string;
  full_upload?: Array<{
    id: number;
    uploads: string;
    sort_order: number;
  }>;
  owner: string;
  created_at: string;
  updated_at?: string;
  geocode?: string;
  // Category-specific fields
  brand?: string;
  model?: string;
  year?: number;
  square?: number;
  rooms?: string;
  // ... other fields
}

export const advertsApi = {
  getByCategory: async (category: string, params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get(`/${category}/adverts`, { params });
    return response.data;
  },

  getById: async (category: string, id: number) => {
    const response = await apiClient.get(`/${category}/${id}`);
    return response.data;
  },

  search: async (query: string, filters?: { category?: string; city?: string }) => {
    const response = await apiClient.post("/search/seek", {
      query,
      ...filters,
    });
    return response.data;
  },

  getNew: async (locale?: string) => {
    const response = await apiClient.get("/new", { params: { locale } });
    return response.data;
  },

  getRecommends: async (locale?: string) => {
    const response = await apiClient.get("/recom/post_recommend", { params: { locale } });
    return response.data;
  },
};
