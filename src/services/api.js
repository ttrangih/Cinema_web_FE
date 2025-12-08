import axios from "axios";

// Lấy base URL từ env
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("[API] BASE_URL =", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

export const loginApi = (email, password) => {
  return api.post ("/auth/login", {email, password});
};

//Movies
export const fetchMovies = async (page = 1, q = "") => {
  const res = await api.get("/movies", {
    params: { page, q },
  });

  // Log URL thực tế được gọi (để debug nếu cần)
  console.log(
    "[API] GET",
    res.config.baseURL + res.config.url,
    "→ status",
    res.status
  );

  return res.data; // { items, pagination }
};

export const fetchMovieDetail = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};



// Showtimes
export const fetchShowtimesByMovie = async (movieId, date) => {
  const res = await api.get(`/movies/${movieId}/showtimes`, {
    params: { date },
  });
  return res.data;
};

// Seats
export const fetchSeatsByShowtime = async (showtimeId) => {
  const res = await api.get(`/showtimes/${showtimeId}/seats`);
  return res.data;
};

export default api;
