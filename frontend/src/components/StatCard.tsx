import React from "react";
import type { AdminOverview } from "../api/adminApi";

type Props = {
  overview?: AdminOverview | null;
};

const AdminStatsCards: React.FC<Props> = ({ overview }) => {
  const cards = [
    {
      key: "users",
      label: "TỔNG NGƯỜI DÙNG",
      value: (overview?.totalUsers ?? 0).toLocaleString(),
      trend: `${overview?.activeUsers ?? 0} đang hoạt động / ${overview?.inactiveUsers ?? 0} bị khóa`,
      type: "normal",
    },
    {
      key: "problems",
      label: "TỔNG BÀI TẬP",
      value: (overview?.totalProblems ?? 0).toLocaleString(),
      trend: `${overview?.publicProblems ?? 0} công khai / ${overview?.privateProblems ?? 0} riêng tư`,
      type: "normal",
    },
    {
      key: "submissions",
      label: "LƯỢT NỘP BÀI",
      value: (overview?.totalSubmissions ?? 0).toLocaleString(),
      trend: `${overview?.acceptedSubmissions ?? 0} bài đúng`,
      type: "normal",
    },
    {
      key: "failed",
      label: "LƯỢT CHƯA ĐÚNG",
      value: (overview?.failedSubmissions ?? 0).toLocaleString(),
      trend: `${overview?.acceptanceRate ?? 0}% tỉ lệ đúng`,
      type: "danger",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "20px",
        marginBottom: "24px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.key}
          className={`admin-card ${card.type === "danger" ? "card-danger" : ""}`}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color:
                  card.type === "danger" ? "rgba(255,255,255,0.8)" : "#888",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {card.label}
            </span>
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: 900,
              margin: "10px 0 6px",
              color: card.type === "danger" ? "var(--white)" : "var(--black)",
              fontFamily: "var(--font-sans)",
              lineHeight: 1,
            }}
          >
            {card.value}
          </div>

          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color:
                card.type === "danger" ? "rgba(255,255,255,0.85)" : "#4ADE80",
            }}
          >
            {card.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
