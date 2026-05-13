import React from "react";

interface SearchProps {
    onSearch: (term: string) => void;
    onFilter: (level: string) => void;
}

const ProblemSearch: React.FC<SearchProps> = ({ onSearch, onFilter }: SearchProps) => {
    return (
        <div style={{ display: 'flex', gap: '15px' }}>
            <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                style={{ padding: '10px', color: 'red' }}
                onChange={(e) => onSearch(e.target.value)}
            />
            <select
                style={{ padding: '10px' }}
                onChange={(e) => onFilter(e.target.value)}
            >
                <option value="All">Tất cả</option>
                <option value="easy">Dễ</option>
                <option value="medium">Vừa</option>
                <option value="hard">Khó</option>
            </select>
        </div>
    );
};

export default ProblemSearch;