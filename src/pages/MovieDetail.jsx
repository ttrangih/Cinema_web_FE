import { useParams, Link } from "react-router-dom";

const demoMovies = [
  {
    id: 1,
    title: "John Wick: Chapter 3 – Parabellum",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODg1MDU2NjMxNF5BMl5BanBnXkFtZTgwNjk0NzA2NzM@._V1_.jpg",
    duration: "2h 10m",
    year: "2019",
    genre: "Action / Thriller",
    rating: "8.1 / 10",
    description: "Siêu sát thủ John Wick buộc phải chạy trốn sau khi phạm luật của tổ chức và bị treo thưởng 14 triệu đô."
  }
];

export default function MovieDetail() {
  const { id } = useParams();
  const movie = demoMovies.find(m => m.id === Number(id));

  if (!movie) return <p className="text-white p-10">Đang tải...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white p-10">
      
      <div className="max-w-6xl mx-auto bg-[#0F172A]/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/10">
        
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Poster */}
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-72 rounded-2xl shadow-xl"
          />

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
            <p className="text-gray-300">{movie.description}</p>

            <div className="mt-5 space-y-2 text-gray-300">
              <p>⭐ <span className="font-semibold">{movie.rating}</span></p>
              <p>{movie.duration} • {movie.year}</p>
              <p className="italic">{movie.genre}</p>
            </div>

            <button className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition">
              ▶ Watch Trailer
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-b border-gray-700"></div>

        {/* SHOWTIMES */}
        <h2 className="text-2xl font-semibold mb-4">Chọn suất chiếu</h2>

        <div className="flex gap-4">
          {["05 Wed", "06 Thu", "07 Fri", "08 Sat", "09 Sun"].map((day, i) => (
            <div
              key={i}
              className="px-6 py-3 bg-[#1E293B] rounded-xl hover:bg-yellow-500 hover:text-black transition cursor-pointer border border-white/10"
            >
              {day}
            </div>
          ))}
        </div>

        <Link 
          to={`/showtimes/${movie.id}`}
          className="inline-block mt-8 px-8 py-3 text-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl"
        >
          Tiếp tục chọn giờ chiếu →
        </Link>
      </div>
    </div>
  );
}
