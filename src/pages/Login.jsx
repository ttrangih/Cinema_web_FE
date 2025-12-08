import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../services/api";
import "./Login.css"; 


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const data = await loginApi(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("user-updated"));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const status = err?.response?.status;

      if (status === 400) {
        setError("Thiếu email hoặc password. Vui lòng nhập đầy đủ.");
      } else if (status === 401) {
        setError("Sai email hoặc password. Vui lòng thử lại.");
      } else if (status === 500) {
        setError("Lỗi server. Vui lòng thử lại sau.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h3 className="login-title">Đăng nhập tài khoản</h3>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>
        </form>

        <p className="login-footer">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="link-register">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
