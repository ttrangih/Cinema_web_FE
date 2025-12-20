import { Link, Outlet } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/movies">🎬 Movies</Link></li>
          <li><Link to="/admin/showtimes">🕒 Showtimes</Link></li>
        </ul>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
