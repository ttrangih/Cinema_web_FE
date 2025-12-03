import clsx from "clsx";

export default function Seat({ seat, toggle }) {
  return (
    <div
      className={clsx(
        "w-10 h-10 border rounded flex items-center justify-center cursor-pointer",
        seat.isBooked && "bg-gray-400 cursor-not-allowed",
        seat.selected && "bg-green-500"
      )}
      onClick={() => !seat.isBooked && toggle(seat.id)}
    >
      {seat.label}
    </div>
  );
}
