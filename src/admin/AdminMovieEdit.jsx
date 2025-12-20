import { useEffect, useState } from "react";
import { adminGetMovie, adminUpdateMovie } from "../services/adminApi";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminMovieEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminGetMovie(id);
    setForm(data);
  }

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function submit() {
    await adminUpdateMovie(id, form);
    nav("/admin/movies");
  }

  return (
    <div>
      <h1>Edit Movie #{id}</h1>

      <input value={form.title || ""} onChange={(e) => update("title", e.target.value)} />
      <input value={form.posterUrl || ""} onChange={(e) => update("posterUrl", e.target.value)} />
      <input value={form.durationMinutes || ""} type="number" onChange={(e) => update("durationMinutes", e.target.value)} />

      <button onClick={submit}>Save</button>
    </div>
  );
}
