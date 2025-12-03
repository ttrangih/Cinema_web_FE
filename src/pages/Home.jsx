import MovieCard from "../components/MovieCard";

export default function Home() {
  // Demo dữ liệu phim
  const movies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      posterUrl: "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg"
    },
    {
      id: 2,
      title: "Jurassic World",
      posterUrl: "https://m.media-amazon.com/images/I/91F12Qv7lQL._AC_SY679_.jpg"
    },
    {
      id: 3,
      title: "Interstellar",
      posterUrl: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg"
    }
  ];

  return (
    <div style={{
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px"
    }}>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      
    <div className="text-3xl font-bold text-red-500">
      Tailwind đã hoạt động!
    </div>

    </div>
  );
}

