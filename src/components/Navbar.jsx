import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  // user hiện tại
  const [user, setUser] = useState(null);

  // tên hiển thị
  const displayName = user?.fullname || user?.email || "";

  // có phải admin không
  const isAdmin = user?.role === "ADMIN";

  // dropdown đang mở: "phim" | "rap" | "admin" | null
  const [openMenu, setOpenMenu] = useState(null);

  // đọc user từ localStorage khi Navbar mount + khi có event "user-updated"
  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    updateUser(); // chạy ngay khi navbar load

    window.addEventListener("user-updated", updateUser);
    return () => window.removeEventListener("user-updated", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const go = (path) => {
    navigate(path);
    setOpenMenu(null);
  };

  // ===== styles =====
  const navStyle = {
    width: "100%",
    background: "#111",
    borderBottom: "1px solid #444",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 50,
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    color: "#a78bfa",
    fontWeight: 800,
    fontSize: "22px",
    letterSpacing: "0.4em",
    textDecoration: "none",
  };

  const menuWrapperStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  };

  const menuListStyle = {
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    gap: "32px",
    margin: 0,
    padding: 0,
    fontSize: "16px",
  };

  const menuLinkStyle = {
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const dropdownContainerStyle = { position: "relative" };

  const dropdownStyle = {
    position: "absolute",
    top: "120%",
    left: 0,
    background: "#1e1e1e",
    border: "1px solid #444",
    borderRadius: "6px",
    padding: "6px 0",
    minWidth: "180px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
    zIndex: 60,
  };

  const dropdownItemStyle = {
    padding: "8px 14px",
    color: "#fff",
    textDecoration: "none",
    display: "block",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  const loginButtonStyle = {
    padding: "6px 14px",
    borderRadius: "4px",
    border: "1px solid #a78bfa",
    color: "#a78bfa",
    background: "transparent",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          CINEMA
        </Link>

        {/* Menu giữa */}
        <div style={menuWrapperStyle}>
          <ul style={menuListStyle}>
            {/* PHIM */}
            <li
              style={dropdownContainerStyle}
              onMouseEnter={() => setOpenMenu("phim")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span style={menuLinkStyle}>
                Phim <span style={{ fontSize: "10px" }}>▼</span>
              </span>

              {openMenu === "phim" && (
                <div style={dropdownStyle}>
                  <span
                    style={dropdownItemStyle}
                    onClick={() => go("/movies/now")}
                  >
                    Đang chiếu
                  </span>
                  <span
                    style={dropdownItemStyle}
                    onClick={() => go("/movies/soon")}
                  >
                    Sắp chiếu
                  </span>
                </div>
              )}
            </li>

            {/* RẠP */}
            <li
              style={dropdownContainerStyle}
              onMouseEnter={() => setOpenMenu("rap")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span style={menuLinkStyle}>
                Rạp <span style={{ fontSize: "10px" }}>▼</span>
              </span>

              {openMenu === "rap" && (
                <div style={dropdownStyle}>
                  <span
                    style={dropdownItemStyle}
                    onClick={() => go("/cinemas")}
                  >
                    Tất cả chi nhánh
                  </span>
                </div>
              )}
            </li>

            {/* Vé của tôi */}
            <li>
              <span style={menuLinkStyle} onClick={() => go("/my-tickets")}>
                Vé của tôi
              </span>
            </li>

            {/* ADMIN – chỉ hiện nếu role = ADMIN */}
            {isAdmin && (
              <li
                style={dropdownContainerStyle}
                onMouseEnter={() => setOpenMenu("admin")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <span style={menuLinkStyle}>
                  Admin <span style={{ fontSize: "10px" }}>▼</span>
                </span>

                {openMenu === "admin" && (
                  <div style={dropdownStyle}>
                    <span
                      style={dropdownItemStyle}
                      onClick={() => go("/admin/movies")}
                    >
                      Quản lý phim
                    </span>
                    <span
                      style={dropdownItemStyle}
                      onClick={() => go("/admin/showtimes")}
                    >
                      Quản lý suất chiếu
                    </span>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Góc phải: user hoặc Đăng nhập */}
        <div>
          {user ? (
            <div
              style={{
                color: "#fff",
                fontWeight: 500,
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <span>{displayName}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid #666",
                  color: "#ccc",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} style={loginButtonStyle}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
