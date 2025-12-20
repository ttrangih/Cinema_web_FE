import axios from "axios";

// Lấy base URL từ env
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("[API] BASE_URL =", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

// Gắn token vào header cho mọi request (auth + admin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//login
export const loginApi = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  // trả về data 
  return res.data; // { token, user }
};

export const registerApi = (fullName, email, password) => {
  return api
    .post("/auth/register", { fullName, email, password })
    .then((res) => res.data); // trả về data
};

//movies
export const fetchMovies = async (page = 1, q = "") => {
  const res = await api.get("/movies", {
    params: { page, q },
  });

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

export const fetchShowtimesByMovie = async (movieId, date) => {
  const res = await api.get(`/movies/${movieId}/showtimes`, {
    params: { date },
  });

  const data = res.data;

  // 1. Nếu backend trả sẵn là mảng các suất chiếu phẳng
  if (Array.isArray(data)) return data;

  // 2. Nếu backend trả { movieId, cinemas: [ { rooms: [ { showtimes: [...] } ] } ] }
  if (Array.isArray(data?.cinemas)) {
    const flat = [];

    data.cinemas.forEach((cinema) => {
      const cinemaName = cinema.cinemaName || cinema.name;
      const cinemaAddress = cinema.address || "";

      (cinema.rooms || []).forEach((room) => {
        (room.showtimes || []).forEach((st) => {
          flat.push({
            cinemaName,
            cinemaAddress,
            roomName: room.roomName,
            roomId: room.roomId,
            showtimeId: st.showtimeId || st.id,
            startTime: st.startTime || st.time,
            price: st.price,
          });
        });
      });
    });

    return flat;
  }

  //Không đúng format thì trả mảng rỗng
  return [];
};

//admin movies CRUD
export const adminFetchMovies = async (page = 1, q = "") => {
  const res = await api.get("/admin/movies", {
    params: { page, q },
  });
  return res.data; // { items, pagination }
};


export const adminCreateMovie = async (payload) => {
  const res = await api.post("/admin/movies", payload);
  return res.data;
};

export const adminUpdateMovie = async (id, payload) => {
  const res = await api.put(`/admin/movies/${id}`, payload);
  return res.data;
};

export const adminDeleteMovie = async (id) => {
  const res = await api.delete(`/admin/movies/${id}`);
  return res.data;
};

//admin showtimes
export const adminFetchShowtimes = async (params = {}) => {
  const res = await api.get("/admin/showtimes", {
    params,
  });
  return res.data; // { items, pagination }
};


export const adminCreateShowtime = async (payload) => {
  const res = await api.post("/admin/showtimes", payload);
  return res.data;
};


export const adminUpdateShowtime = async (id, payload) => {
  const res = await api.put(`/admin/showtimes/${id}`, payload);
  return res.data;
};


export const adminDeleteShowtime = async (id) => {
  const res = await api.delete(`/admin/showtimes/${id}`);
  return res.data;
};

export default api;
