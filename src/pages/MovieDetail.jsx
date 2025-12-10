import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetail, fetchShowtimesByMovie } from "../services/api";
import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [errorMovie, setErrorMovie] = useState("");
  const [errorShowtimes, setErrorShowtimes] = useState("");

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

  // Gom suất chiếu theo rạp
  const showtimesByCinema = {};
  if (Array.isArray(showtimes)) {
    for (const st of showtimes) {
      const cinemaName =
        st.cinemaName || st.cinema?.name || "Rạp chưa xác định";
      if (!showtimesByCinema[cinemaName]) {
        showtimesByCinema[cinemaName] = [];
      }
      showtimesByCinema[cinemaName].push(st);
    }
  }

  // Format ngày + giờ
  const formatTime = (raw) => {
    const d = new Date(raw || "");
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (raw) => {
    const d = new Date(raw || "");
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }); // ví dụ: "Th 4, 10/12"
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
                      const dateKey = (st.startTime || st.time || "").slice(
                        0,
                        10
                      ); // YYYY-MM-DD
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
                                    <button
                                      key={key}
                                      type="button"
                                      className="showtime-chip"
                                      onClick={() => navigate(`/seats/${key}`)}
                                    >
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
