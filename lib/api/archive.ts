import { apiClient } from "./client";

export const archiveApi = {
  getArchive: async () => {
    const response = await apiClient.get("/archive/");
    return response.data;
  },

  archiveAd: async (advertId: number) => {
    const response = await apiClient.post(`/archive/${advertId}`);
    return response.data;
  },

  restoreAd: async (advertId: number) => {
    // Restore by updating the ad
    const response = await apiClient.put(`/archive/${advertId}`, {
      archived: false,
    });
    return response.data;
  },

  deleteFromArchive: async (advertId: number) => {
    const response = await apiClient.delete(`/archive/${advertId}`);
    return response.data;
  },
};
