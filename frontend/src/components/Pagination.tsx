import React from 'react';

interface PaginationProps{
    currentPage: number;
    totalProblems: number;
    problemsPerPage: number;
    onPageChange: (page: number)=> void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalProblems,
    problemsPerPage,
    onPageChange
    }) => {
    const pageNumbers = [];
    for(let i=1; i<=Math.ceil(totalProblems/problemsPerPage); i++){
        pageNumbers.push(i);
    }
    return (
        <div>
            <button
            disabled={currentPage===1}
            onClick={() => onPageChange(currentPage-1)}
            >
                Trước
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={()=> onPageChange(number)}
                    style={{backgroundColor: 'yellow'

                    }}
                >
                    {number}
                </button>
            ))}

            <button
            disabled={currentPage===pageNumbers.length}
            onClick={()=> onPageChange(currentPage+1)}
            style={{color: 'green'}}
            >
                Tiếp
            </button>
        </div>
    );
};

export default Pagination;