// src/pages/Problems.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import ProblemCard from "../components/ProblemCard";
import type { Problem } from "../components/ProblemCard";
import UserSidebar from "../components/UserSidebar";
import leaderboardStyles from "../styles/modules/Leaderboard.module.css";

interface TagDTO {
  tagId: number;
  tagName: string;
}

interface ProblemDTO {
  problemId: number;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: TagDTO[];
  timeLimitMs: number;
  isPublic: boolean;
  solvedCount?: number;
}

interface ProblemQueryState {
  search: string;
  topic: string;
  diffs: string[];
  currentPage: number;
  pageSize: number;
}

const PAGE_SIZE = 5;

const toCardProblem = (dto: ProblemDTO): Problem => ({
  problem_id: dto.problemId,
  title: dto.title,
  description: dto.description,
  difficulty: dto.difficulty,
  tags: dto.tags?.map((tag) => tag.tagName) ?? [],
  solved_count: dto.solvedCount ?? 0,
  time_limit_ms: dto.timeLimitMs,
  is_public: dto.isPublic,
});

const TOPIC_MAP: Record<string, string[]> = {
  "array-string": ["String"],
  sorting: ["Sorting"],
  "data-structure": ["Data Structure"],
  "dynamic-programming": ["Dynamic Programming"],
  graph: ["Graph"],
  math: ["Math"],
  bitmask: ["Bitmask"],
  geometry: ["Geometry"],
};

const FILTER_TOPICS = [
  { label: "Tất cả bài tập", value: "" },
  { label: "Mảng & Chuỗi", value: "array-string" },
  { label: "Sắp xếp", value: "sorting" },
  { label: "Cấu trúc dữ liệu", value: "data-structure" },
  { label: "Quy hoạch động", value: "dynamic-programming" },
  { label: "Đồ thị", value: "graph" },
  { label: "Toán học", value: "math" },
];

const DIFFICULTIES = [
  { label: "Dễ", value: "EASY" },
  { label: "Trung bình", value: "MEDIUM" },
  { label: "Khó", value: "HARD" },
];

const initialQuery: ProblemQueryState = {
  search: "",
  topic: "",
  diffs: [],
  currentPage: 1,
  pageSize: PAGE_SIZE,
};

const Problems: React.FC = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState<ProblemQueryState>(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError("");

        // Backend-ready: query holds keyword/topic/difficulty/page/size for future API params.
        const res = await api.get<ProblemDTO[]>("/problems");

        setProblems(res.data.map(toCardProblem));
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const setQueryAndResetPage = (
    updater: (current: ProblemQueryState) => ProblemQueryState,
  ) => {
    setQuery((current) => ({ ...updater(current), currentPage: 1 }));
  };

  const filtered = useMemo(() => {
    const keyword = query.search.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchSearch =
        !keyword ||
        problem.title.toLowerCase().includes(keyword) ||
        String(problem.problem_id).includes(keyword);

      const matchTopic =
        !query.topic ||
        (() => {
          const mapped = TOPIC_MAP[query.topic] ?? [query.topic];

          return problem.tags.some((tag) => mapped.includes(tag));
        })();

      const matchDiff =
        query.diffs.length === 0 || query.diffs.includes(problem.difficulty);

      return matchSearch && matchTopic && matchDiff;
    });
  }, [problems, query.diffs, query.search, query.topic]);

  const paginatedProblems = useMemo(() => {
    const start = (query.currentPage - 1) * query.pageSize;

    return filtered.slice(start, start + query.pageSize);
  }, [filtered, query.currentPage, query.pageSize]);

  const topicCount = (value: string) => {
    if (!value) return problems.length;

    const mapped = TOPIC_MAP[value] ?? [value];

    return problems.filter((problem) =>
      problem.tags.some((tag) => mapped.includes(tag)),
    ).length;
  };

  const toggleDiff = (value: string) => {
    setQueryAndResetPage((current) => ({
      ...current,
      diffs: current.diffs.includes(value)
        ? current.diffs.filter((diff) => diff !== value)
        : [...current.diffs, value],
    }));
  };

  const activeFilterCount = (query.topic ? 1 : 0) + query.diffs.length;

  const content = (() => {
    if (loading) {
      return <div className="prob-state">Đang tải dữ liệu...</div>;
    }

    if (error) {
      return <div className="prob-state prob-state--error">{error}</div>;
    }

    return (
      <>
        <section className="prob-hero">
          <h1 className="prob-hero__title">DANH SÁCH BÀI TẬP</h1>
          <p className="prob-hero__subtitle">
            Chọn bài phù hợp, lọc nhanh theo chủ đề và độ khó.
          </p>
        </section>

        <main className="prob-body">
          <div className="prob-list">
            <div className="prob-search-wrap">
              <div className="prob-search">
                <input
                  className="prob-search__input"
                  placeholder="Tìm kiếm bài tập..."
                  value={query.search}
                  onChange={(event) =>
                    setQueryAndResetPage((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                />

                <button
                  type="button"
                  className={`prob-filter-toggle ${
                    isFilterOpen ? "prob-filter-toggle--active" : ""
                  }`}
                  aria-label="Mở bộ lọc"
                  aria-expanded={isFilterOpen}
                  onClick={() => setIsFilterOpen((open) => !open)}
                >
                  <span aria-hidden="true">☰</span>
                  {activeFilterCount > 0 && (
                    <strong>{activeFilterCount}</strong>
                  )}
                </button>
              </div>

              {isFilterOpen && (
                <div className="prob-filter-panel">
                  <div className="prob-filter-section">
                    <div className="prob-filter-title">Chủ đề</div>
                    <div className="prob-topic-grid">
                      {FILTER_TOPICS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          className={`prob-topic-btn ${
                            query.topic === item.value
                              ? "prob-topic-btn--active"
                              : ""
                          }`}
                          onClick={() =>
                            setQueryAndResetPage((current) => ({
                              ...current,
                              topic: item.value,
                            }))
                          }
                        >
                          <span>{item.label}</span>
                          <strong>{topicCount(item.value)}</strong>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="prob-filter-section">
                    <div className="prob-filter-title">Độ khó</div>
                    <div className="prob-difficulty-row">
                      {DIFFICULTIES.map((difficulty) => (
                        <label
                          key={difficulty.value}
                          className="prob-difficulty-check"
                        >
                          <input
                            type="checkbox"
                            checked={query.diffs.includes(difficulty.value)}
                            onChange={() => toggleDiff(difficulty.value)}
                          />
                          <span
                            className={`diff-text--${difficulty.value.toLowerCase()}`}
                          >
                            {difficulty.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="prob-clear-btn"
                    onClick={() => setQuery(initialQuery)}
                  >
                    Xóa lọc
                  </button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="prob-empty">Không tìm thấy bài tập.</div>
            ) : (
              <>
                <div className="prob-result-meta">
                  Hiển thị {paginatedProblems.length} / {filtered.length} bài
                  tập
                </div>

                {paginatedProblems.map((problem) => (
                  <ProblemCard
                    key={problem.problem_id}
                    problem={problem}
                    onSolve={(id: number) => navigate(`/problems/${id}`)}
                  />
                ))}

                <Pagination
                  currentPage={query.currentPage}
                  totalProblems={filtered.length}
                  problemsPerPage={query.pageSize}
                  onPageChange={(page) =>
                    setQuery((current) => ({
                      ...current,
                      currentPage: page,
                    }))
                  }
                />
              </>
            )}
          </div>
        </main>
      </>
    );
  })();

  return (
    <div className={leaderboardStyles.pageLayout}>
      <UserSidebar />

      <div className={leaderboardStyles.mainArea}>
        <Navbar
          title="DANH SÁCH BÀI TẬP"
          subtitle="Luyện tập thuật toán với bộ đề ByeBug."
        />

        <div className={`${leaderboardStyles.content} problems-page`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Problems;
