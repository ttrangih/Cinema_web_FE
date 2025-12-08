import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../services/api";
import "./Register.css"; 

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerApi({ fullName, email, password });
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);

      const status = err?.response?.status;

      if (status === 400) {
        setError("Thiếu thông tin bắt buộc. Vui lòng kiểm tra lại.");
      } else if (status === 409) {
        setError("Email đã tồn tại. Vui lòng dùng email khác.");
      } else if (status === 500) {
        setError("Lỗi server. Vui lòng thử lại sau.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Đăng ký tài khoản</h2>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-register">
            Đăng ký
          </button>
        </form>

        <p className="register-footer">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="link-login">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
