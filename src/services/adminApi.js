import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});


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
  const res = await adminApi.get("/admin/movies", {
    params: { q, page },
  });
  return res.data; // { items, pagination }
}


// POST /api/admin/movies
export async function adminCreateMovie(payload) {
  const res = await adminApi.post("/admin/movies", payload);
  return res.data;
}

// PUT /api/admin/movies/:id
export async function adminUpdateMovie(id, payload) {
  const res = await adminApi.put(`/admin/movies/${id}`, payload);
  return res.data;
}

// DELETE /api/admin/movies/:id
export async function adminDeleteMovie(id) {
  const res = await adminApi.delete(`/admin/movies/${id}`);
  return res.data;
}

// GET /api/admin/movies/:id
export async function adminGetMovie(id) {
  const res = await adminApi.get(`/admin/movies/${id}`);
  return res.data;
}
