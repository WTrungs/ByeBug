import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalProblems: number;
    problemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalProblems,
    problemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalProblems / problemsPerPage);
    if (totalPages <= 1) return null;

    // Hiện tối đa 5 trang xung quanh trang hiện tại
    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="problems-pagination">
            {/* PREV */}
            <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ← Trước
            </button>

            {/* PAGE NUMBERS */}
            {getPageNumbers().map((page, i) =>
                page === '...'
                    ? <span key={`dots-${i}`} style={{ padding: '0 4px', fontWeight: 700, color: '#aaa' }}>…</span>
                    : (
                        <button
                            key={page}
                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page as number)}
                        >
                            {page}
                        </button>
                    )
            )}

            {/* NEXT */}
            <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Tiếp →
            </button>
        </div>
    );
};

export default Pagination;