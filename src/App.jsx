import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import Showtimes from "./pages/Showtimes";
import Seats from "./pages/Seats";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <div className="bg-[#222] min-h-screen text-white">
      <Navbar />

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/now" element={<Home />} />
          <Route path="/movies/soon" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cinemas" element={<Home />} />
          <Route path="/my-tickets" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/showtimes/:id" element={<Showtimes />} />
          <Route path="/seats/:id" element={<Seats />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* fallback: nếu lạc route thì vẫn trả Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
