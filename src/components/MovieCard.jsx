import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div
      style={{
        background: "#1f1f1f",
        borderRadius: "10px",
        padding: "16px",
        border: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "540px",
      }}
    >
      <div>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            width: "100%",
            height: "360px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />

        <h3
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "600",
            color: "white",
            marginBottom: "20px",
            minHeight: "48px",
          }}
        >
          {movie.title}
        </h3>
      </div>

      {/* 2 nút */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "auto",
        }}
      >
        {/* Xem chi tiết */}
        <Link
          to={`/movie/${movie.id}`}
          style={{
            textAlign: "center",
            padding: "10px 0",
            borderRadius: "6px",
            background: "white",
            color: "#000",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          Xem chi tiết
        </Link>

        {/* Đặt vé */}
        <Link
          to={`/showtimes/${movie.id}`}
          style={{
            textAlign: "center",
            padding: "10px 0",
            borderRadius: "6px",
            background: "#e50914",
            color: "white",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          Đặt vé
        </Link>
      </div>
    </div>
  );
}
