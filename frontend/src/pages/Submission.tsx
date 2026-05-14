import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import VerdictBadge from "../components/VerdictBadge";
import {
  getSubmissionHistory,
  type SubmissionHistoryItem,
  type Verdict,
} from "../api/submissionApi";
import submissionStyles from "../styles/modules/Submission.module.css";
import tableStyles from "../styles/modules/Statistic.module.css";

const verdictOptions: Array<Verdict | "ALL"> = [
  "ALL",
  "AC",
  "WA",
  "TLE",
  "MLE",
  "RTE",
  "CE",
  "SE",
  "PENDING",
  "JUDGING",
];

const formatRuntime = (timeMs: number | null) =>
  timeMs == null ? "-" : `${timeMs} ms`;

const formatMemory = (memoryKb: number | null) =>
  memoryKb == null ? "-" : `${memoryKb} KB`;

const verdictLabel = (verdict: Verdict | "ALL") =>
  verdict === "ALL" ? "Tất cả kết quả" : verdict;

const languageLabel = (language: string) =>
  language === "ALL" ? "Tất cả ngôn ngữ" : language;

const Submission = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<Verdict | "ALL">("ALL");
  const [languageFilter, setLanguageFilter] = useState("ALL");

  const retryLoadSubmissions = () => {
    setLoading(true);
    setError("");

    getSubmissionHistory()
      .then(setSubmissions)
      .catch(() => {
        setError("Khong the tai lich su nop bai. Vui long thu lai.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let isMounted = true;

    getSubmissionHistory()
      .then((items) => {
        if (isMounted) {
          setSubmissions(items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Khong the tai lich su nop bai. Vui long thu lai.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((submission) => {
        const matchesTitle = submission.problemTitle
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase());
        const matchesVerdict =
          verdictFilter === "ALL" || submission.verdict === verdictFilter;
        const matchesLanguage =
          languageFilter === "ALL" || submission.language === languageFilter;

        return matchesTitle && matchesVerdict && matchesLanguage;
      }),
    [languageFilter, searchQuery, submissions, verdictFilter],
  );

  const languageOptions = useMemo(
    () => ["ALL", ...Array.from(new Set(submissions.map((item) => item.language)))],
    [submissions],
  );

  return (
    <div className={submissionStyles.pageLayout}>
      <UserSidebar />

      <div className={submissionStyles.mainArea}>
        <Navbar
          title="SUBMISSIONS"
          subtitle="Theo dõi lịch sử nộp bài và kết quả chấm của bạn."
        />

        <main className={submissionStyles.content}>
          <section className={submissionStyles.hero}>
            <h1>SUBMISSIONS</h1>
            <p>
              Lưu lại các lần nộp bài gần đây, trạng thái chấm, thời gian chạy
              và bộ nhớ để bạn nhanh chóng tìm đúng lỗi cần sửa.
            </p>
          </section>

          <section className={submissionStyles.toolbar} aria-label="Bộ lọc submissions">
            <input
              className={submissionStyles.searchInput}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo tên bài..."
              aria-label="Tìm submission theo tên bài"
            />

            <select
              className={submissionStyles.selectInput}
              value={verdictFilter}
              onChange={(event) =>
                setVerdictFilter(event.target.value as Verdict | "ALL")
              }
              aria-label="Lọc theo kết quả"
            >
              {verdictOptions.map((verdict) => (
                <option key={verdict} value={verdict}>
                  {verdictLabel(verdict)}
                </option>
              ))}
            </select>

            <select
              className={submissionStyles.selectInput}
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              aria-label="Lọc theo ngôn ngữ"
            >
              {languageOptions.map((language) => (
                <option key={language} value={language}>
                  {languageLabel(language)}
                </option>
              ))}
            </select>
          </section>

          <section
            className={submissionStyles.board}
            aria-label="Bảng lịch sử nộp bài"
          >
            {loading && (
              <div className={submissionStyles.statusPanel}>
                Đang tải lịch sử nộp bài...
              </div>
            )}

            {!loading && error && (
              <div className={submissionStyles.statusPanel}>
                <p className={submissionStyles.errorText}>{error}</p>
                <button
                  type="button"
                  className={submissionStyles.retryButton}
                  onClick={retryLoadSubmissions}
                >
                  Thử lại
                </button>
              </div>
            )}

            {!loading && !error && (
              <table className={tableStyles.submissionTable}>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Bài toán</th>
                    <th>Ngôn ngữ</th>
                    <th>Kết quả</th>
                    <th>Runtime</th>
                    <th>Memory</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.submissionId}>
                      <td className={tableStyles.cellMono}>
                        {submission.submittedAt}
                      </td>
                      <td className={tableStyles.cellProblem}>
                        <button
                          type="button"
                          className={submissionStyles.problemLink}
                          onClick={() =>
                            navigate(`/problems/${submission.problemId}`)
                          }
                        >
                          #{submission.problemId} {submission.problemTitle}
                        </button>
                      </td>
                      <td className={tableStyles.cellMonoMid}>
                        {submission.language}
                      </td>
                      <td>
                        <VerdictBadge verdict={submission.verdict} />
                      </td>
                      <td className={tableStyles.cellMonoMid}>
                        {formatRuntime(submission.totalTimeMs)}
                      </td>
                      <td className={tableStyles.cellMonoMid}>
                        {formatMemory(submission.maxMemoryKb)}
                      </td>
                      <td className={submissionStyles.scoreCell}>
                        {submission.score}
                      </td>
                    </tr>
                  ))}

                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={7} className={tableStyles.emptyRow}>
                        Không tìm thấy submission phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Submission;
