import { useState } from "react";
import { adminCreateMovie } from "../services/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminMovieCreate() {
  const [form, setForm] = useState({});
  const nav = useNavigate();

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function submit() {
    await adminCreateMovie(form);
    nav("/admin/movies");
  }

  return (
    <div>
      <h1>Create Movie</h1>

      <input placeholder="Title" onChange={(e) => update("title", e.target.value)} />
      <input placeholder="Poster URL" onChange={(e) => update("posterUrl", e.target.value)} />
      <input placeholder="Duration (min)" type="number" onChange={(e) => update("durationMinutes", e.target.value)} />

      <button onClick={submit}>Save</button>
    </div>
  );
}
