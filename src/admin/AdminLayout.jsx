import { NavLink, Outlet } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `admin-nav-link ${isActive ? "active" : ""}`;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-title">Admin Panel</div>
          <div className="admin-brand-sub">CINEMA</div>
        </div>

        <nav>
          <ul className="admin-nav">
            <li>
              <NavLink to="/admin/dashboard" className={linkClass}>
                <span className="admin-nav-icon">📊</span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/movies" className={linkClass}>
                <span className="admin-nav-icon">🎬</span>
                <span>Movies</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/showtimes" className={linkClass}>
                <span className="admin-nav-icon">🕒</span>
                <span>Showtimes</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/users" className={linkClass}>
                <span className="admin-nav-icon">👤</span>
                <span>Users</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
