import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // nếu BE dùng cookie
});

// Nếu bạn dùng JWT Bearer
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== ADMIN MOVIES =====

// GET /api/admin/movies?q=&page=
export async function adminGetMovies({ q = "", page = 1 }) {
  const res = await adminApi.get("/api/admin/movies", {
    params: { q, page },
  });
  return res.data;
}

// POST /api/admin/movies
export async function adminCreateMovie(payload) {
  const res = await adminApi.post("/api/admin/movies", payload);
  return res.data;
}

// PUT /api/admin/movies/:id
export async function adminUpdateMovie(id, payload) {
  const res = await adminApi.put(`/api/admin/movies/${id}`, payload);
  return res.data;
}

// DELETE /api/admin/movies/:id
export async function adminDeleteMovie(id) {
  const res = await adminApi.delete(`/api/admin/movies/${id}`);
  return res.data;
}
