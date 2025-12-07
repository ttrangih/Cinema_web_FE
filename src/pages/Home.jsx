import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { fetchMovies } from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMovies = async (pageNumber) => {
    const data = await fetchMovies(pageNumber, "");

    const normalized = (data.items || []).map((m) => ({
      ...m,
      posterUrl: m.posterurl || m.posterUrl,
    }));

    setMovies(normalized);
    if (data.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  };

  useEffect(() => {
    loadMovies(page);
  }, [page]);

  return (
    <div style={{ padding: "20px" }}>
      {/* ==== GRID LAYOUT GIỮ NGUYÊN ==== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",   // giống layout cũ
          gap: "35px",
          justifyItems: "center",
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* ==== PHÂN TRANG DƯỚI CÙNG ==== */}
      <div
        style={{
          marginTop: "40px",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: page === 1 ? "not-allowed" : "pointer",
            border: "none",
            backgroundColor: page === 1 ? "#555" : "#fff",
            color: page === 1 ? "#aaa" : "#000",
          }}
        >
          Trang trước
        </button>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            border: "none",
            backgroundColor: page === totalPages ? "#555" : "#e50914",
            color: "#fff",
          }}
        >
          Trang tiếp theo
        </button>
      </div>
    </div>
  );
}
