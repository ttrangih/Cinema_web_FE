import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import  api from "../services/api";

export default function Showtimes() {
  const { id } = useParams();
  const [showtime, setShowtime] = useState(null);

  useEffect(() => {
    api.get(`/showtimes/${id}`).then(res => setShowtime(res.data));
  }, [id]);

  if (!showtime) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">
        {showtime.movieTitle} — {showtime.time}
      </h1>

      <Link
        to={`/seats/${showtime.id}`}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Chọn ghế
      </Link>
    </div>
  );
}
