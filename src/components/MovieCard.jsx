import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <img 
        src={movie.posterUrl} 
        alt={movie.title} 
        style={{ width: "100%", borderRadius: "6px" }}
      />
      <h3 style={{ marginTop: "10px", fontSize: "18px" }}>{movie.title}</h3>

      <Link
        to={`/movie/${movie.id}`}
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "6px 12px",
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px"
        }}
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

