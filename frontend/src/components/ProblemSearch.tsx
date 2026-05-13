import React from 'react';

interface SearchProps {
    onSearch: (term: string) => void;
    onFilter: (level: string) => void;
}

const ProblemSearch: React.FC<SearchProps> = ({ onSearch, onFilter }) => {
    return (
        <div className="problems-search-bar">

            {/* SEARCH INPUT */}
            <div className="problems-search-input-wrap">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder="Tìm kiếm bài tập..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            {/* FILTER SELECT */}
            <select
                className="problems-filter-select"
                onChange={(e) => onFilter(e.target.value)}
                defaultValue="All"
            >
                <option value="All">Tất cả</option>
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
            </select>

        </div>
    );
};

export default ProblemSearch;