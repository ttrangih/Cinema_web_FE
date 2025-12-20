import { useEffect, useState } from "react";
import { adminGetMovies, adminDeleteMovie } from "../services/adminApi";
import { Link } from "react-router-dom";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await adminGetMovies(q);
    setMovies(res.items);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this movie?")) return;
    await adminDeleteMovie(id);
    load();
  }

  return (
    <div>
      <h1>Movies</h1>

      <div style={{ marginBottom: 20 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." />
        <button onClick={load}>Search</button>
        <Link to="/admin/movies/create">+ Add Movie</Link>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>Title</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {movies.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td><img src={m.posterUrl} width="60" /></td>
              <td>{m.title}</td>
              <td>{m.durationMinutes} min</td>
              <td>
                <Link to={`/admin/movies/${m.id}/edit`}>Edit</Link> |
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
