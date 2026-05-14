import React, { useState } from "react";
import DifficultyBadge from "../../components/DifficultyBadge";

const ProblemManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "EASY",
      submissions: 1250,
      status: "STABLE",
      lastUpdate: "2024-05-10",
    },
    {
      id: 2,
      title: "Longest Path",
      difficulty: "HARD",
      submissions: 850,
      status: "BUGGED",
      lastUpdate: "2024-05-12",
    },
    {
      id: 3,
      title: "Palindromic String",
      difficulty: "MEDIUM",
      submissions: 2100,
      status: "STABLE",
      lastUpdate: "2024-05-08",
    },
  ];

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter ? p.difficulty === diffFilter : true;
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchDiff && matchStatus;
  });

  const newest = [
    { title: "Tìm số đảo ngược", time: "12 phút trước", level: "Dễ" },
    { title: "Thuật toán Dijkstra", time: "2 giờ trước", level: "Khó" },
    { title: "Dãy con tăng dài nhất", time: "5 giờ trước", level: "Vừa" },
  ];

  const popular = [
    {
      id: "01",
      title: "Tính tổng 2 số nguyên",
      rate: "92%",
      subs: "4.5k",
      level: "Dễ",
    },
    {
      id: "02",
      title: "Kiểm tra số nguyên tố",
      rate: "85%",
      subs: "3.2k",
      level: "Vừa",
    },
    {
      id: "03",
      title: "Bài toán đường đi",
      rate: "65%",
      subs: "1.8k",
      level: "Khó",
    },
  ];

  return (
    <div className="pm-wrapper">
      {/* PHẦN 1: BÀI MỚI & PHỔ BIẾN */}
      <div className="pm-top-grid">
        {/* BÀI MỚI NHẤT */}
        <div className="pm-card">
          <div className="pm-card-header">
            <span className="pm-card-icon">❇️</span>
            <h3 className="pm-card-title">Bài mới nhất</h3>
          </div>
          <div className="pm-list">
            {newest.map((p, i) => (
              <div key={i} className="pm-list-item">
                <div className="pm-item-info">
                  <div className="pm-item-name">{p.title}</div>
                  <div className="pm-item-meta">🕒 {p.time}</div>
                </div>
                <DifficultyBadge level={p.level} />
              </div>
            ))}
          </div>
        </div>

        {/* PHỔ BIẾN NHẤT */}
        <div className="pm-card">
          <div className="pm-card-header">
            <span className="pm-card-icon">🔥</span>
            <h3 className="pm-card-title">Phổ biến nhất</h3>
          </div>
          <div className="pm-list">
            {popular.map((p, i) => (
              <div key={i} className="pm-list-item">
                <span className="pm-rank-num">{p.id}</span>
                <div className="pm-item-info">
                  <div className="pm-item-name">{p.title}</div>
                  <div className="pm-item-meta-row">
                    <span className="pm-ac-badge">AC {p.rate}</span>
                    <span className="pm-subs-text">{p.subs} lượt giải</span>
                  </div>
                </div>
                <DifficultyBadge level={p.level} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHẦN 2: NGÂN HÀNG ĐỀ BÀI */}
      <div className="pm-card">
        <div className="pm-table-header">
          <h2 className="pm-table-title">Ngân hàng đề bài</h2>
          <div className="pm-filter-row">
            <div className="pm-search-box">
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="pm-select"
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
            >
              <option value="">Độ khó</option>
              <option value="EASY">Dễ</option>
              <option value="MEDIUM">Vừa</option>
              <option value="HARD">Khó</option>
            </select>
            <select
              className="pm-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="STABLE">Stable</option>
              <option value="BUGGED">Bugged</option>
            </select>
          </div>
        </div>

        <table className="pm-table">
          <thead>
            <tr>
              <th>Mã đề bài</th>
              <th>Tên bài tập</th>
              <th style={{ textAlign: "center" }}>Độ khó</th>
              <th style={{ textAlign: "center" }}>Trạng thái</th>
              <th style={{ textAlign: "center" }}>Lượt giải</th>
              <th style={{ textAlign: "center" }}>Cập nhật</th>
              <th style={{ textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prob) => (
              <tr key={prob.id}>
                <td className="pm-id-cell">#PB-00{prob.id}</td>
                <td className="pm-name-cell">{prob.title}</td>
                <td style={{ textAlign: "center" }}>
                  <DifficultyBadge level={prob.difficulty} />
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    className={`pm-status-badge pm-status-${prob.status.toLowerCase()}`}
                  >
                    {prob.status === "STABLE" ? " Stable" : " Bugged"}
                  </span>
                </td>
                <td className="pm-subs-cell">
                  {prob.submissions.toLocaleString()}
                </td>
                <td className="pm-date-cell">{prob.lastUpdate}</td>
                <td>
                  <div className="pm-actions">
                    <button className="pm-btn-edit" title="Chỉnh sửa">
                      ✏️
                    </button>
                    <button className="pm-btn-delete" title="Xóa">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#999",
                  }}
                >
                  Không tìm thấy bài tập nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemManagement;
