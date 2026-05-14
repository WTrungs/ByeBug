import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalProblems: number;
    problemsPerPage: number;
    onPageChange: (page: number) => void;
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
    const pages = new Set<number>([1, totalPages]);

    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
        if (page >= 1 && page <= totalPages) {
            pages.add(page);
        }
    }

    return [...pages].sort((a, b) => a - b);
};

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalProblems,
    problemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalProblems / problemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisiblePages(currentPage, totalPages);

    return (
        <nav className="prob-pagination" aria-label="Phân trang bài tập">
            <button
                type="button"
                className="prob-page-btn prob-page-btn--nav"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Trước
            </button>

            {visiblePages.map((page, index) => {
                const previous = visiblePages[index - 1];
                const hasGap = previous && page - previous > 1;

                return (
                    <React.Fragment key={page}>
                        {hasGap && <span className="prob-page-gap">...</span>}
                        <button
                            type="button"
                            className={`prob-page-btn ${
                                currentPage === page ? 'prob-page-btn--active' : ''
                            }`}
                            aria-current={currentPage === page ? 'page' : undefined}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </React.Fragment>
                );
            })}

            <button
                type="button"
                className="prob-page-btn prob-page-btn--nav"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Tiếp
            </button>
        </nav>
    );
};

export default Pagination;
