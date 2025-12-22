import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchMovieDetail, fetchShowtimesByMovie } from "../services/api";
import { isLoggedIn } from "../utils/auth";
import "./MovieDetail.css";

const startOfLocalDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getLocalDateKey = (iso) => {
  const d = new Date(iso);          // UTC -> local
  d.setHours(0, 0, 0, 0);
  return d.getTime();              // key theo local day
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [errorMovie, setErrorMovie] = useState("");
  const [errorShowtimes, setErrorShowtimes] = useState("");

  const handlePickShowtime = (showtimeId) => {
  if (!isLoggedIn()) {
    navigate("/login", {
      state: { from: `/seats/${showtimeId}` },
    });
    return;
  }

  navigate(`/seats/${showtimeId}`);
};


  useEffect(() => {
    if (!id) return;

    const loadMovie = async () => {
      try {
        setLoadingMovie(true);
        setErrorMovie("");
        const data = await fetchMovieDetail(id);
        setMovie(data);
      } catch (err) {
        console.error("Failed to load movie detail:", err);
        setErrorMovie("Không tải được thông tin phim.");
      } finally {
        setLoadingMovie(false);
      }
    };

    const loadShowtimes = async () => {
      try {
        setLoadingShowtimes(true);
        setErrorShowtimes("");
        const data = await fetchShowtimesByMovie(id); // đã flatten ở api.js
        setShowtimes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load showtimes:", err);
        setErrorShowtimes("Không tải được suất chiếu.");
      } finally {
        setLoadingShowtimes(false);
      }
    };

    loadMovie();
    loadShowtimes();
  }, [id]);

  if (loadingMovie) {
    return <div className="movie-detail-page">Đang tải thông tin phim...</div>;
  }

  if (errorMovie) {
    return <div className="movie-detail-page error-text">{errorMovie}</div>;
  }

  if (!movie) {
    return <div className="movie-detail-page">Không tìm thấy phim.</div>;
  }

  const {
    title,
    description,
    durationminutes,
    releasedate,
    agerating,
    posterurl,
    trailerurl,
  } = movie;

const today = startOfLocalDay(new Date());

const todayShowtimes = showtimes.filter((st) => {
  const d = startOfLocalDay(new Date(st.startTime));
  return d.getTime() === today.getTime();
});



const displayShowtimes = todayShowtimes;
  // Gom suất chiếu theo rạp
  const showtimesByCinema = {};
  if (Array.isArray(displayShowtimes)) {
    for (const st of displayShowtimes) {
      const cinemaName =
        st.cinemaName || st.cinema?.name || "Rạp chưa xác định";
      if (!showtimesByCinema[cinemaName]) {
        showtimesByCinema[cinemaName] = [];
      }
      showtimesByCinema[cinemaName].push(st);
    }
  }

  // Format ngày giờ
const formatTime = (raw) => {
  if (!raw) return "";
  // raw: 2025-12-21T17:00:00.000Z
  return raw.slice(11, 16); // "17:00"
};

const formatDate = (raw) => {
  const date = new Date(raw);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
};


  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        {/* Poster */}
        <div className="movie-detail-poster">
          <img src={posterurl} alt={title} />
        </div>

        {/* Thông tin phim */}
        <div className="movie-detail-info">
          <h1 className="movie-title">{title}</h1>

          {description && <p className="movie-description">{description}</p>}

          <div className="movie-meta">
            {durationminutes && (
              <div>
                <span className="meta-label">Thời lượng:</span>{" "}
                {durationminutes} phút
              </div>
            )}
            {releasedate && (
              <div>
                <span className="meta-label">Khởi chiếu:</span>{" "}
                {new Date(releasedate).toLocaleDateString("vi-VN")}
              </div>
            )}
            {agerating && (
              <div>
                <span className="meta-label">Độ tuổi:</span> {agerating}
              </div>
            )}
          </div>

          {trailerurl && (
            <a
              href={trailerurl}
              target="_blank"
              rel="noreferrer"
              className="btn-trailer"
            >
              Xem trailer
            </a>
          )}
        </div>
      </div>

      {/* Suất chiếu */}
      <div className="showtimes-section">
        <h2 className="showtimes-title">Suất chiếu</h2>

        {loadingShowtimes && <p>Đang tải suất chiếu...</p>}

        {errorShowtimes && (
          <p className="error-text">{errorShowtimes}</p>
        )}

        {!loadingShowtimes && !errorShowtimes && (
          <>
            {showtimes.length === 0 ? (
              <p className="no-showtimes">
                Hiện chưa có suất chiếu cho phim này.
              </p>
            ) : (
              <div className="showtimes-list">
                {Object.entries(showtimesByCinema).map(
                  ([cinemaName, list]) => {
                    const first = list[0] || {};
                    const address =
                      first.cinemaAddress || first.cinema?.address || "";

                    // nhóm tiếp theo ngày
                    const byDate = {};
                    list.forEach((st) => {
                     const dateKey = getLocalDateKey(st.startTime || st.time); // YYYY-MM-DD
                      if (!byDate[dateKey]) byDate[dateKey] = [];
                      byDate[dateKey].push(st);
                    });

                    return (
                      <div
                        key={cinemaName}
                        className="showtime-cinema-card"
                      >
                        <div className="showtime-cinema-header">
                          <div>
                            <p className="cinema-name">{cinemaName}</p>
                            {address && (
                              <p className="cinema-address">{address}</p>
                            )}
                          </div>
                        </div>

                        {/* mỗi ngày 1 hàng giờ chiếu */}
                        {Object.entries(byDate).map(([dateKey, items]) => {
                          const sorted = [...items].sort((a, b) => {
                            const da = new Date(
                              a.startTime || a.time || 0
                            ).getTime();
                            const db = new Date(
                              b.startTime || b.time || 0
                            ).getTime();
                            return da - db;
                          });

                          return (
                            <div
                              key={dateKey}
                              className="showtime-date-group"
                            >
                              <div className="showtime-date-label">
                                {formatDate(sorted[0].startTime || sorted[0].time)}
                              </div>
                              <div className="showtime-times">
                                {sorted.map((st) => {
                                  const key =
                                    st.showtimeId ||
                                    st.id ||
                                    st.startTime ||
                                    st.time;
                                  const timeStr = formatTime(
                                    st.startTime || st.time
                                  );

                                  return (
                                    <button key={key}
                                            type="button"
                                            className="showtime-chip"
                                            onClick={() => handlePickShowtime(key)}>
                                            {timeStr}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
