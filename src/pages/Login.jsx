import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi(email, password);

      // Backend trả { token, user }
      const { token, user } = res.data;

      // Lưu vào localStorage để Navbar dùng
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setLoading(false);
      navigate("/");// quay về trang chủ
    } catch (err) {
      console.error(err);
      setLoading(false);
      console.error("Login error:", err);
      if (err.response?.status === 401){
        setError("Email hoặc mật khẩu không đúng.");
      }
      else{
      setError(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại."
      );
    }
  }
};

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-500 rounded-md px-3 py-2">
            {error}
          </div>
        )} {/*báo lỗi */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md px-3 py-2 bg-neutral-800 border border-neutral-600 focus:outline-none focus:border-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 bg-neutral-800 border border-neutral-600 focus:outline-none focus:border-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-semibold py-2 transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
