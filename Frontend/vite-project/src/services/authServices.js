
import api from "./api";

export const propertyService = {
  getAll: (params = {}) => api.get("/properties", { params }),

  getById: (id) => api.get(`/properties/${id}`),

  search: (params) => api.get("/properties/search", { params }),

  smartMatch: (preferences) =>
    api.post("/properties/match", preferences),

  create: (formData) =>
    api.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    api.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => api.delete(`/properties/${id}`),

  save: (id) => api.post(`/users/me/saved-properties/${id}`),

  getSaved: () => api.get("/users/me/saved-properties"),
};
