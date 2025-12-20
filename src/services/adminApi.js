import api from "./api";

// MOVIES
export const adminGetMovies = async (q = "", page = 1) =>
  (await api.get("/admin/movies", { params: { q, page } })).data;

export const adminGetMovie = async (id) =>
  (await api.get(`/admin/movies/${id}`)).data;

export const adminCreateMovie = async (payload) =>
  (await api.post("/admin/movies", payload)).data;

export const adminUpdateMovie = async (id, payload) =>
  (await api.put(`/admin/movies/${id}`, payload)).data;

export const adminDeleteMovie = async (id) =>
  (await api.delete(`/admin/movies/${id}`)).data;

