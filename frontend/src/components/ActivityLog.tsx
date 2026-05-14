import React from "react";
import type { AdminActivity } from "../api/adminApi";

type Props = {
  activities?: AdminActivity[];
};

const statusColor: Record<string, { bg: string; color: string }> = {
  AC: { bg: "#dcfce7", color: "#16a34a" },
  SUCCESS: { bg: "#dcfce7", color: "#16a34a" },
  PENDING: { bg: "#fff4d6", color: "#a66a00" },
  WA: { bg: "#ffdae4", color: "#d62a4d" },
  TLE: { bg: "#ffdae4", color: "#d62a4d" },
  MLE: { bg: "#ffdae4", color: "#d62a4d" },
  RTE: { bg: "#ffdae4", color: "#d62a4d" },
  RE: { bg: "#ffdae4", color: "#d62a4d" },
  CE: { bg: "#ffdae4", color: "#d62a4d" },
  SE: { bg: "#ffdae4", color: "#d62a4d" },
};

const formatTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

const actionLabel: Record<string, string> = {
  submission: "Nộp bài",
};

const ActivityLog: React.FC<Props> = ({ activities = [] }) => {
  return (
    <div className="activity-log-card">
      <div className="activity-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h3 className="chart-title">NHẬT KÝ SUBMISSION GẦN ĐÂY</h3>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="neo-grid-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người dùng</th>
              <th>Hành động</th>
              <th>Bài tập</th>
              <th style={{ textAlign: "right" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((log) => {
              const s = statusColor[log.status] ?? {
                bg: "#f3f4f6",
                color: "#374151",
              };
              return (
                <tr key={log.id}>
                  <td className="time-cell">{formatTime(log.time)}</td>
                  <td className="user-cell">@{log.user}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {actionLabel[log.action] ?? log.action}
                  </td>
                  <td>{log.target}</td>
                  <td style={{ textAlign: "right" }}>
                    <span
                      className="action-badge"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {activities.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "32px" }}>
                  Chưa có submission nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
