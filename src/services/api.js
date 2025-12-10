import axios from "axios";

// Lấy base URL từ env
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("[API] BASE_URL =", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

//login
export const loginApi = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  // Backend trả { token, user }
  return res.data;
};

//register
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

  // Log URL thực tế được gọi (để debug)
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


// Seats
export const fetchSeatsByShowtime = async (showtimeId) => {
  const res = await api.get(`/showtimes/${showtimeId}/seats`);
  return res.data;
};

export default api;
