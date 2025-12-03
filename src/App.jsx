import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Showtimes from "./pages/Showtimes";
import Seats from "./pages/Seats";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/showtimes/:id" element={<Showtimes />} />
        <Route path="/seats/:id" element={<Seats />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

    </BrowserRouter>
  );
}
