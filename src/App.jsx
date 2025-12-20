import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import Showtimes from "./pages/Showtimes";
import Seats from "./pages/Seats";
import Checkout from "./pages/Checkout";

//admin
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminMovies from "./admin/AdminMovies";
import AdminMovieCreate from "./admin/AdminMovieCreate";
import AdminMovieEdit from "./admin/AdminMovieEdit";
import AdminGuard from "./components/AdminGuard";

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

          {/*admin*/}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />

            {/* Movie*/}
            <Route path="movies" element={<AdminMovies />} />
            <Route path="movies/create" element={<AdminMovieCreate />} />
            <Route path="movies/:id/edit" element={<AdminMovieEdit />} />
          </Route> 

          {/* fallback */}
          <Route path="*" element={<Home />} />

        </Routes>
      </main>
    </div>
  );
}
