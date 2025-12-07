import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Seat from "../components/Seat";

export default function Seats() {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/showtimes/${id}/seats`).then(res => setSeats(res.data));
  }, [id]);

  const toggleSeat = (seatId) => {
    setSeats(prev =>
      prev.map(s => s.id === seatId ? { ...s, selected: !s.selected } : s)
    );
  };

  const handleCheckout = () =>
    navigate("/checkout", {
      state: { seats: seats.filter(s => s.selected), showtimeId: id },
    });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Chọn ghế</h1>

      <div className="grid grid-cols-8 gap-2 my-4">
        {seats.map(seat => (
          <Seat key={seat.id} seat={seat} toggle={toggleSeat} />
        ))}
      </div>

      <button
        onClick={handleCheckout}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Tiếp tục
      </button>
    </div>
  );
}
