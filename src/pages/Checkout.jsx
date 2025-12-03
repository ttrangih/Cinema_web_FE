import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleBook = async () => {
    await api.post("/booking", {
      showtimeId: state.showtimeId,
      seats: state.seats.map(s => s.id),
    });

    alert("Đặt vé thành công!");
    navigate("/");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Xác nhận thông tin</h1>

      <p>Suất chiếu: {state.showtimeId}</p>
      <p>Ghế chọn: {state.seats.map(s => s.label).join(", ")}</p>

      <button
        onClick={handleBook}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Đặt vé
      </button>
    </div>
  );
}
