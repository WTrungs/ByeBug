import { useEffect, useState } from "react";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import ProblemSearch from "../components/ProblemSearch";
import ProblemTable from "../components/ProblemTable";
import Pagination from "../components/Pagination";
import { getAllProblems } from "../api/problemApi";
import type { Problem } from "../api/problemApi";
import styles from "../styles/modules/Statistic.module.css";

const Problems = () => {
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const problemsPerPage = 4;

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await getAllProblems();
      setAllProblems(data);
      setError("");
    } catch (err) {
      console.error("Lỗi API:", err);
      setError("Không thể tải danh sách bài tập! Kiểm tra lại Backend đi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const filtered: Problem[] = allProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterLevel === "All" || p.difficulty === filterLevel),
  );

  const currentProblems = filtered.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage,
  );

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        <Navbar
          title="DANH SÁCH BÀI TẬP"
          subtitle="Chọn bài phù hợp và bắt đầu giải ngay."
        />

        <div className={styles.content}>
          {loading && (
            <div className={styles.card}>
              <div className={styles.emptyRow}>Đang tải dữ liệu từ server...</div>
            </div>
          )}

          {!loading && error && (
            <div className={styles.card}>
              <div className={styles.emptyRow}>
                <p className={styles.errorText}>{error}</p>
                <button className={styles.doNowBtn} onClick={fetchProblems}>
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <ProblemSearch
                onSearch={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
                onFilter={(val) => {
                  setFilterLevel(val);
                  setCurrentPage(1);
                }}
              />

              <ProblemTable problems={currentProblems} />

              <Pagination
                currentPage={currentPage}
                totalProblems={filtered.length}
                problemsPerPage={problemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
