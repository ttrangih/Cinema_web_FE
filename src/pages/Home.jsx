import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { fetchMovies } from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Home mounted");
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMovies(1, "");
        console.log("Movies from API:", data);

        // backend trả posterurl → map sang posterUrl cho MovieCard
        const normalized = (data.items || []).map((m) => ({
          ...m,
          posterUrl: m.posterurl || m.posterUrl,
        }));

        setMovies(normalized);
      } catch (err) {
        console.error("Failed to load movies:", err);
        setError("Không tải được danh sách phim");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);



  if (loading) return <div className="p-6 text-xl">Đang tải phim...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  return (
    <div
      style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
