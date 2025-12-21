import { useEffect, useState } from "react";
import {
  adminGetMovies,
  adminDeleteMovie,
  adminCreateMovie,
} from "../services/adminApi";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    releaseDate: "",
    ageRating: "",
    posterUrl: "",
    trailerUrl: "",
  });

  async function load() {
    const data = await adminGetMovies({ q, page });
    setMovies(data.items);
  }

  useEffect(() => {
    load();
  }, [page]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this movie?")) return;
    await adminDeleteMovie(id);
    load();
  }

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitCreate() {
    if (!form.title || !form.durationMinutes) {
      return alert("Title & Duration are required");
    }

    await adminCreateMovie({
      ...form,
      durationMinutes: Number(form.durationMinutes),
    });

    setOpenCreate(false);
    setForm({
      title: "",
      description: "",
      durationMinutes: "",
      releaseDate: "",
      ageRating: "",
      posterUrl: "",
      trailerUrl: "",
    });
    load();
  }

  return (
    <div>
      <h1 className="admin-title">Movies</h1>

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <input
            className="admin-input"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="admin-btn" onClick={() => load()}>
            Search
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setOpenCreate(true)}
          >
            + Add Movie
          </button>
        </div>

        {/* Table */}
        <table className="admin-table">
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
                <td>
                  <img src={m.posterUrl} className="admin-poster" />
                </td>
                <td>{m.title}</td>
                <td>{m.durationMinutes} min</td>
                <td>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {openCreate && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Add Movie</h3>
              <button onClick={() => setOpenCreate(false)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <input className="admin-input" placeholder="Title" onChange={(e)=>update("title", e.target.value)} />
              <input className="admin-input" placeholder="Poster URL" onChange={(e)=>update("posterUrl", e.target.value)} />
              <input className="admin-input" placeholder="Trailer URL" onChange={(e)=>update("trailerUrl", e.target.value)} />
              <input className="admin-input" type="number" placeholder="Duration (min)" onChange={(e)=>update("durationMinutes", e.target.value)} />
              <input className="admin-input" type="date" onChange={(e)=>update("releaseDate", e.target.value)} />
              <input className="admin-input" placeholder="Age Rating" onChange={(e)=>update("ageRating", e.target.value)} />
              <textarea className="admin-input" placeholder="Description" onChange={(e)=>update("description", e.target.value)} />

              <button className="admin-btn admin-btn-primary" onClick={submitCreate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
