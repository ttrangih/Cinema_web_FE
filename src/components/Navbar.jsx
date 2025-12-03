import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      width: "100%",
      background: "black",
      color: "white",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Link to="/" style={{ fontSize: "22px", fontWeight: "bold", color: "white", textDecoration: "none" }}>
        🎬 MovieBooking
      </Link>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>
          Phim
        </Link>
      </div>
    </nav>
  );
}
