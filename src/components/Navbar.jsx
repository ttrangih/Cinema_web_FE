import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null); // chia thành 3 ô
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error("Cannot parse user from localStorage", e);
    }
  }, []);

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

  const dropdownContainerStyle = {
    position: "relative",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "120%",
    left: 0,
    background: "#1e1e1e",
    border: "1px solid #444",
    borderRadius: "6px",
    padding: "6px 0",
    minWidth: "160px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
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

  const handleDropdownClick = (menuKey) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const go = (path) => {
    navigate(path);
    setOpenMenu(null);
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo trái */}
        <Link to="/" style={logoStyle}>
          CINEMA
        </Link>

        {/* Menu giữa */}
        <div style={menuWrapperStyle}>
          <ul style={menuListStyle}>
            {/* PHIM + dropdown */}
            <li style={dropdownContainerStyle}>
              <span
                style={menuLinkStyle}
                onClick={() => handleDropdownClick("phim")}
              >
                <span>Phim</span>
                <span style={{ fontSize: "10px" }}>▼</span>
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

            {/* RẠP + dropdown */}
            <li style={dropdownContainerStyle}>
              <span
                style={menuLinkStyle}
                onClick={() => handleDropdownClick("rap")}
              >
                <span>Rạp</span>
                <span style={{ fontSize: "10px" }}>▼</span>
              </span>
              {openMenu === "rap" && (
                <div style={dropdownStyle}>
                  <span
                    style={dropdownItemStyle}
                    onClick={() => go("/cinemas")}
                  >
                    Tất cả chi nhánh
                  </span>
                  {/* sau này có thể thêm chi nhánh A/B/C */}
                </div>
              )}
            </li>

            {/* Vé của tôi */}
            <li>
              <Link to="/my-tickets" style={menuLinkStyle}>
                Vé của tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Đăng nhập / user phải */}
        <div>
          {user ? (
            <span style={{ color: "#fff", fontWeight: 500 }}>
              {user.fullName || user.email || "User"}
            </span>
          ) : (
            <Link to="/login" style={loginButtonStyle}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
