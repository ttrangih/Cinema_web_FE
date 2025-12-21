export default function AdminDashboard() {
  const stats = [
    { label: "Tổng Movies", value: 42, icon: "🎬" },
    { label: "Tổng Showtimes", value: 128, icon: "🕒" },
    { label: "Tổng Users", value: 560, icon: "👤" },
    { label: "Vé đã bán", value: 2310, icon: "🎟️" },
  ];

  return (
    <div>
      <h1 className="admin-title">Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} className="admin-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 26 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, marginTop: 2 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="admin-card" style={{ minHeight: 240 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Doanh thu theo ngày (placeholder)</div>
          <div style={{ opacity: 0.7 }}>
          </div>
        </div>

        <div className="admin-card" style={{ minHeight: 240 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Top Movies (placeholder)</div>
          <div style={{ opacity: 0.7 }}>
          </div>
        </div>
      </div>
    </div>
  );
}
