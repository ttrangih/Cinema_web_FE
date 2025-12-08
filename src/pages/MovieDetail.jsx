import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {fetchMovieDetail,fetchShowtimesByMovie,} from "../services/api"; 
import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [errorMovie, setErrorMovie] = useState("");
  const [errorShowtimes, setErrorShowtimes] = useState("");

  useEffect(() => {
    if (!id) return;

    // Load thông tin phim
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

    // Load suất chiếu theo phim
    const loadShowtimes = async () => {
      try {
        setLoadingShowtimes(true);
        setErrorShowtimes("");
        const data = await fetchShowtimesByMovie(id); // date để trống → BE tự xử lý
        // đảm bảo là mảng
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

  const formatShowtime = (raw) => {
    const d = new Date(
      raw || ""
    ); /* nếu parse fail thì trả string gốc bên dưới */
    if (Number.isNaN(d.getTime())) return raw || "";
    // ví dụ: 09/12 19:30
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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

                    // sort theo thời gian
                    const sortedList = [...list].sort((a, b) => {
                      const da = new Date(a.startTime || a.time || 0).getTime();
                      const db = new Date(b.startTime || b.time || 0).getTime();
                      return da - db;
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

                        <div className="showtime-times">
                          {sortedList.map((st) => {
                            const key =
                              st.id || st.showtimeId || st.startTime || st.time;
                            const timeStr = formatShowtime(
                              st.startTime || st.time
                            );

                            return (
                              <button
                                key={key}
                                type="button"
                                className="showtime-chip"
                                // gắn navigate đến màn chọn ghế
                                // onClick={() => navigate(`/booking/${key}`)}
                              >
                                {timeStr}
                              </button>
                            );
                          })}
                        </div>
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
