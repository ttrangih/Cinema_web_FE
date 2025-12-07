import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetail } from "../services/api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMovieDetail(id);
        setMovie(data);
      } catch (err) {
        console.error("Failed to load movie detail:", err);
        setError("Không tải được thông tin phim");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div className="p-6 text-xl">Đang tải thông tin phim...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!movie) return <div className="p-6">Không tìm thấy phim.</div>;

  // Backend trả dạng: title, description, durationminutes, releasedate, agerating, posterurl, trailerurl
  const {
    title,
    description,
    durationminutes,
    releasedate,
    agerating,
    posterurl,
    trailerurl,
  } = movie;

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3">
        <img
          src={posterurl}
          alt={title}
          className="w-full rounded-lg shadow"
        />
      </div>

      <div className="w-full md:w-2/3 space-y-3">
        <h1 className="text-3xl font-bold">{title}</h1>

        {description && (
          <p className="text-gray-700">
            {description}
          </p>
        )}

        <div className="space-y-1 text-sm text-gray-600">
          {durationminutes && (
            <div>
              <span className="font-semibold">Thời lượng:</span>{" "}
              {durationminutes} phút
            </div>
          )}
          {releasedate && (
            <div>
              <span className="font-semibold">Khởi chiếu:</span>{" "}
              {new Date(releasedate).toLocaleDateString()}
            </div>
          )}
          {agerating && (
            <div>
              <span className="font-semibold">Độ tuổi:</span>{" "}
              {agerating}
            </div>
          )}
        </div>

        {trailerurl && (
          <a
            href={trailerurl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Xem trailer
          </a>
        )}
      </div>
    </div>
  );
}
