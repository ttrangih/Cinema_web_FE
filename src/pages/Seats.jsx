import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api"; // axios instance của bạn (BASE_URL + interceptors)
import "./Seats.css";

export default function Seats() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [seatRows, setSeatRows] = useState([]); // raw from API
  const [showtimeInfo, setShowtimeInfo] = useState(null); // optional info if API returns
  const [selected, setSelected] = useState(new Set()); // store seatId

  // --- fetch seats by showtimeId ---
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // API: GET /showtimes/:id/seats
        // Kỳ vọng trả về dạng: { showtime: {...}, seats: [...] } hoặc chỉ [...].
        const res = await api.get(`/showtimes/${showtimeId}/seats`);

        const data = res.data;

        // Normalize:
        const seats = Array.isArray(data) ? data : data.seats || [];
        const info = Array.isArray(data) ? null : data.showtime || data.showtimeInfo || null;

        if (!mounted) return;

        setSeatRows(seats);
        setShowtimeInfo(info);
      } catch (err) {
        console.error("Failed to load seats:", err);
        alert("Không tải được danh sách ghế.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [showtimeId]);

  // ---- group seats by row (A, B, C...) & sort by seatnumber ----
  const grouped = useMemo(() => {
    // Bạn đang có schema seats: id, seatrow, seatnumber, seattype, isactive
    // Và trạng thái booked thường sẽ có field: isBooked / status / available...
    const map = new Map();
    for (const s of seatRows) {
      const rowKey = s.seatrow ?? s.row ?? "";
      if (!map.has(rowKey)) map.set(rowKey, []);
      map.get(rowKey).push(s);
    }

    // sort rows descending như ảnh (K -> A). Nếu bạn muốn A->K thì đổi sort.
    const rows = Array.from(map.keys()).sort((a, b) => String(b).localeCompare(String(a)));

    return rows.map((r) => {
      const seats = map
        .get(r)
        .slice()
        .sort((a, b) => (a.seatnumber ?? a.number ?? 0) - (b.seatnumber ?? b.number ?? 0));
      return { row: r, seats };
    });
  }, [seatRows]);

  const selectedSeats = useMemo(() => {
    const sel = [];
    for (const s of seatRows) {
      const sid = s.id ?? s.seatId;
      if (selected.has(String(sid))) sel.push(s);
    }
    // sort by row then number for pretty display
    sel.sort((a, b) => {
      const ra = String(a.seatrow ?? a.row ?? "");
      const rb = String(b.seatrow ?? b.row ?? "");
      if (ra !== rb) return ra.localeCompare(rb);
      return (a.seatnumber ?? a.number ?? 0) - (b.seatnumber ?? b.number ?? 0);
    });
    return sel;
  }, [seatRows, selected]);

  const total = useMemo(() => {
    // nếu API có price theo ghế -> dùng; không thì dùng showtime price.
    const base = Number(showtimeInfo?.price ?? 0);
    return selectedSeats.reduce((sum, s) => {
      const seatPrice = s.price != null ? Number(s.price) : base;
      return sum + (Number.isFinite(seatPrice) ? seatPrice : 0);
    }, 0);
  }, [selectedSeats, showtimeInfo]);

  const formatSeatLabel = (s) => `${s.seatrow ?? s.row}${s.seatnumber ?? s.number}`;
  const formatMoney = (n) => (n || 0).toLocaleString("vi-VN") + " đ";

  const isBooked = (s) => {
    // bạn chỉnh theo field thật từ BE:
    // ví dụ: s.isbooked, s.isBooked, s.status === 'BOOKED', s.available === false...
    if (s.isBooked === true) return true;
    if (s.isbooked === true) return true;
    if (s.available === false) return true;
    if (String(s.status).toUpperCase() === "BOOKED") return true;
    return false;
  };

  const isDisabled = (s) => {
    const active = s.isactive ?? s.isActive ?? true;
    return !active || isBooked(s);
  };

  const seatType = (s) => String(s.seattype ?? s.seatType ?? "").toLowerCase(); // vip/normal...
  const seatClassByType = (s) => {
    const t = seatType(s);
    if (t.includes("vip")) return "seat--vip";
    return "seat--standard";
  };

  const toggleSeat = (s) => {
    const sid = String(s.id ?? s.seatId);
    if (isDisabled(s)) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      alert("Bạn chưa chọn ghế.");
      return;
    }

    // Nếu bạn muốn “bấm tiếp tục là pop up payment luôn”
    // thì ở đây bạn có thể mở modal payment.
    // Còn nếu muốn tạo booking trước:
    // POST /bookings { showtimeId, seatIds: [...] }
    try {
      // ⚠️ tuỳ payload BE của bạn (đổi field cho đúng)
      const payload = {
        showtimeId: Number(showtimeId),
        seatIds: selectedSeats.map((s) => Number(s.id ?? s.seatId)),
      };

      // Nếu endpoint bookings cần token -> axios interceptor sẽ tự gắn Authorization
      const res = await api.post("/bookings", payload);

      // Sau khi tạo booking OK: mở payment popup / chuyển trang payment
      // Demo: chuyển sang /payment/:bookingId
      const bookingId = res.data?.bookingId ?? res.data?.id;
      alert("Đặt ghế thành công! (Demo) Mở payment ở bước kế tiếp.");

      if (bookingId) navigate(`/payment/${bookingId}`);
    } catch (err) {
      console.error("Booking failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể đặt ghế. Có thể ghế vừa bị người khác chọn.";
      alert(msg);
    }
  };

  // --- Header info (không có poster) ---
  const meta = useMemo(() => {
    // Nếu BE seats API không trả showtime info, bạn có thể truyền qua location.state khi navigate từ MovieDetail
    // hoặc gọi thêm GET /showtimes/:id (nếu có).
    const cinema = showtimeInfo?.cinemaName || showtimeInfo?.cinema || "Rạp";
    const room = showtimeInfo?.roomName || showtimeInfo?.room || "Phòng";
    const start = showtimeInfo?.startTime || showtimeInfo?.starttime;
    const dt = start ? new Date(start) : null;

    const time = dt
      ? dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : "--:--";
    const date = dt ? dt.toLocaleDateString("vi-VN") : "--/--/----";

    return { cinema, room, time, date };
  }, [showtimeInfo]);

  return (
    <div className="seats-wrap">
      <div className="seats-container">
        {/* LEFT: seat map */}
        <section className="seats-left">
          <div className="seats-topbar">
            <div className="seats-step">Chọn ghế</div>
          </div>

          <div className="seats-card">
            <div className="screen">Màn hình</div>

            {loading ? (
              <div className="seats-loading">Đang tải ghế...</div>
            ) : (
              <div className="seat-map">
                {grouped.map(({ row, seats }) => (
                  <div key={row} className="seat-row">
                    <div className="seat-row-label">{row}</div>

                    <div className="seat-row-seats">
                      {seats.map((s) => {
                        const sid = String(s.id ?? s.seatId);
                        const picked = selected.has(sid);
                        const disabled = isDisabled(s);

                        return (
                          <button
                            key={sid}
                            type="button"
                            className={[
                              "seat",
                              seatClassByType(s),
                              picked ? "seat--selected" : "",
                              disabled ? "seat--sold" : "",
                            ].join(" ")}
                            onClick={() => toggleSeat(s)}
                            disabled={disabled}
                            title={formatSeatLabel(s)}
                          >
                            {s.seatnumber ?? s.number}
                          </button>
                        );
                      })}
                    </div>

                    <div className="seat-row-label seat-row-label--right">{row}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="legend">
              <div className="legend-item">
                <span className="dot dot--sold" /> Ghế đã bán
              </div>
              <div className="legend-item">
                <span className="dot dot--selected" /> Ghế đang chọn
              </div>
              <div className="legend-item">
                <span className="dot dot--standard" /> Ghế thường
              </div>
              <div className="legend-item">
                <span className="dot dot--vip" /> Ghế VIP
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: summary */}
        <aside className="seats-right">
          <div className="summary-card">
            <div className="summary-title">
              {meta.cinema} - {meta.room}
            </div>

            <div className="summary-sub">
              Suất: <b>{meta.time}</b> — {meta.date}
            </div>

            <div className="summary-line" />

            <div className="summary-block">
              <div className="summary-label">Ghế đã chọn</div>
              {selectedSeats.length === 0 ? (
                <div className="summary-muted">Chưa chọn ghế</div>
              ) : (
                <div className="summary-seats">
                  {selectedSeats.map((s) => (
                    <span key={String(s.id ?? s.seatId)} className="chip">
                      {formatSeatLabel(s)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="summary-line" />

            <div className="summary-total">
              <span>Tổng cộng</span>
              <b>{formatMoney(total)}</b>
            </div>

            <div className="summary-actions">
              <button className="btn btn--ghost" onClick={() => navigate(-1)}>
                Quay lại
              </button>

              <button className="btn btn--primary" onClick={handleContinue}>
                Tiếp tục
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
