import React, { useEffect, useMemo, useRef, useState } from "react";
import DifficultyBadge from "../../components/DifficultyBadge";
import "../../components/ConfirmModal.css";
import {
  getAdminProblems,
  getLatestAdminProblems,
  getPopularAdminProblems,
  setAdminProblemVisibility,
  type AdminProblem,
  type AdminProblemPage,
} from "../../api/adminApi";

const PAGE_SIZE = 10;

const emptyPage: AdminProblemPage = {
  content: [],
  page: 0,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
};

const difficultyOptions = [
  { value: "", label: "Độ khó" },
  { value: "EASY", label: "Dễ" },
  { value: "MEDIUM", label: "Vừa" },
  { value: "HARD", label: "Khó" },
];

const visibilityOptions = [
  { value: "all", label: "Tất cả" },
  { value: "public", label: "Công khai" },
  { value: "hidden", label: "Ẩn" },
];

type FilterKey = "difficulty" | "visibility";

const formatDate = (value?: string | null) => {
  if (!value) return "Chưa rõ";

  try {
    return new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const formatCount = (count: number) => count.toLocaleString("vi-VN");

const ProblemManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [page, setPage] = useState(0);
  const [problemPage, setProblemPage] = useState<AdminProblemPage>(emptyPage);
  const [latest, setLatest] = useState<AdminProblem[]>([]);
  const [popular, setPopular] = useState<AdminProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<AdminProblem | null>(null);
  const [savingProblemId, setSavingProblemId] = useState<number | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      search: search.trim() || undefined,
      difficulty: diffFilter || undefined,
      visibility: visibilityFilter,
      sort: "createdAt,desc",
    }),
    [diffFilter, page, search, visibilityFilter],
  );

  const loadProblems = async () => {
    setLoading(true);
    setError("");

    try {
      const [problemData, latestData, popularData] = await Promise.all([
        getAdminProblems(listParams),
        getLatestAdminProblems(3),
        getPopularAdminProblems(3),
      ]);

      setProblemPage(problemData);
      setLatest(latestData);
      setPopular(popularData);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu ngân hàng đề bài.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, [listParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetToFirstPage = () => {
    if (page !== 0) {
      setPage(0);
    }
  };

  const openVisibilityModal = (problem: AdminProblem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const handleVisibilityChange = async () => {
    if (!selectedProblem) return;

    setSavingProblemId(selectedProblem.problemId);
    try {
      await setAdminProblemVisibility(selectedProblem.problemId, !selectedProblem.isPublic);
      setIsModalOpen(false);
      setSelectedProblem(null);
      await loadProblems();
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật trạng thái hiển thị của bài tập.");
    } finally {
      setSavingProblemId(null);
    }
  };

  const renderFilterDropdown = (
    key: FilterKey,
    value: string,
    options: Array<{ value: string; label: string }>,
    onChange: (nextValue: string) => void,
    ariaLabel: string,
  ) => {
    const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label;
    const isOpen = openFilter === key;

    return (
      <div className={`pm-filter-select ${isOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="pm-filter-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setOpenFilter((current) => (current === key ? null : key))}
        >
          <span>{selectedLabel}</span>
          <span className="pm-filter-chevron" aria-hidden="true" />
        </button>

        {isOpen && (
          <div className="pm-filter-menu" role="listbox" aria-label={ariaLabel}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`pm-filter-option ${value === option.value ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  resetToFirstPage();
                  setOpenFilter(null);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProblemList = (items: AdminProblem[], emptyText: string, mode: "latest" | "popular") => {
    if (items.length === 0) {
      return <div className="pm-empty-list">{emptyText}</div>;
    }

    return (
      <div className="pm-list">
        {items.map((problem, index) => (
          <div key={problem.problemId} className="pm-list-item">
            {mode === "popular" && <span className="pm-rank-num">{String(index + 1).padStart(2, "0")}</span>}
            <div className="pm-item-info">
              <div className="pm-item-name">{problem.title}</div>
              {mode === "latest" ? (
                <div className="pm-item-meta">{formatDate(problem.createdAt)}</div>
              ) : (
                <div className="pm-item-meta-row">
                  <span className="pm-ac-badge">AC {problem.acceptanceRate}%</span>
                  <span className="pm-subs-text">{formatCount(problem.totalSubmissions)} lượt nộp</span>
                </div>
              )}
            </div>
            <DifficultyBadge level={problem.difficulty} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pm-wrapper">
      <div className="pm-top-grid">
        <div className="pm-card">
          <div className="pm-card-header">
            <span className="pm-card-icon" aria-hidden="true">+</span>
            <h3 className="pm-card-title">Bài mới nhất</h3>
          </div>
          {renderProblemList(latest, "Chưa có bài tập nào.", "latest")}
        </div>

        <div className="pm-card">
          <div className="pm-card-header">
            <span className="pm-card-icon" aria-hidden="true">#</span>
            <h3 className="pm-card-title">Phổ biến nhất</h3>
          </div>
          {renderProblemList(popular, "Chưa có dữ liệu lượt nộp.", "popular")}
        </div>
      </div>

      <div className="pm-card pm-bank-card">
        <div className="pm-table-header">
          <h2 className="pm-table-title">Ngân hàng đề bài</h2>
          <div className="pm-filter-row" ref={filtersRef}>
            <div className="pm-search-box">
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetToFirstPage();
                }}
              />
            </div>
            {renderFilterDropdown("difficulty", diffFilter, difficultyOptions, setDiffFilter, "Chọn độ khó")}
            {renderFilterDropdown("visibility", visibilityFilter, visibilityOptions, setVisibilityFilter, "Chọn trạng thái")}
          </div>
        </div>

        {error && <div className="pm-state pm-state-error">{error}</div>}
        {loading ? (
          <div className="pm-state">Đang tải dữ liệu...</div>
        ) : (
          <>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Mã đề bài</th>
                  <th>Tên bài tập</th>
                  <th style={{ textAlign: "center" }}>Độ khó</th>
                  <th style={{ textAlign: "center" }}>Trạng thái</th>
                  <th style={{ textAlign: "center" }}>Lượt nộp</th>
                  <th style={{ textAlign: "center" }}>Cập nhật</th>
                  <th style={{ textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {problemPage.content.map((problem) => (
                  <tr key={problem.problemId}>
                    <td className="pm-id-cell">#PB-{String(problem.problemId).padStart(4, "0")}</td>
                    <td className="pm-name-cell">{problem.title}</td>
                    <td style={{ textAlign: "center" }}>
                      <DifficultyBadge level={problem.difficulty} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`pm-status-badge ${problem.isPublic ? "pm-status-public" : "pm-status-hidden"}`}>
                        {problem.isPublic ? "Công khai" : "Ẩn"}
                      </span>
                    </td>
                    <td className="pm-subs-cell">
                      <div>{formatCount(problem.totalSubmissions)}</div>
                      <small>AC {problem.acceptanceRate}%</small>
                    </td>
                    <td className="pm-date-cell">{formatDate(problem.createdAt)}</td>
                    <td>
                      <div className="pm-actions">
                        <button
                          className={`pm-btn-visibility ${problem.isPublic ? "pm-btn-hide" : "pm-btn-publish"}`}
                          onClick={() => openVisibilityModal(problem)}
                          disabled={savingProblemId === problem.problemId}
                        >
                          {problem.isPublic ? "Ẩn" : "Mở"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {problemPage.content.length === 0 && (
                  <tr>
                    <td colSpan={7} className="pm-empty-cell">
                      Không tìm thấy bài tập nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pm-pagination">
              <span>
                Hiển thị {problemPage.content.length} / {formatCount(problemPage.totalElements)} bài
              </span>
              <div className="pm-page-actions">
                <button type="button" disabled={page <= 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
                  Trước
                </button>
                <strong>
                  Trang {problemPage.totalPages === 0 ? 0 : problemPage.page + 1} / {problemPage.totalPages}
                </strong>
                <button
                  type="button"
                  disabled={problemPage.totalPages === 0 || page >= problemPage.totalPages - 1}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && selectedProblem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {selectedProblem.isPublic ? "Ẩn bài tập?" : "Công khai bài tập?"}
            </h3>
            <p>
              Bài tập <strong>{selectedProblem.title}</strong> sẽ được chuyển sang trạng thái{" "}
              <strong>{selectedProblem.isPublic ? "Ẩn" : "Công khai"}</strong>.
            </p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={handleVisibilityChange} disabled={savingProblemId !== null}>
                Xác nhận
              </button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemManagement;
