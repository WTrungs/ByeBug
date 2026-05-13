import React from 'react';

interface SidebarProps {
    onFilterLevel: (level: string) => void;
    onFilterTag: (tag: string) => void;
    totalCount: number;
    filteredCount: number;
}

const ProblemSidebar: React.FC<SidebarProps> = ({ 
    onFilterLevel, 
    onFilterTag, 
    totalCount, 
    filteredCount 
}) => {
    // Mock data cho Tags - Sau này bạn có thể fetch từ API tags
    const tags = [
        { name: 'Mảng & Chuỗi', count: 420 },
        { name: 'Cấu trúc cây', count: 156 },
        { name: 'Quy hoạch động', count: 89 },
        { name: 'Đồ thị & BFS/DFS', count: 210 }
    ];

    return (
        <aside className="problems-sidebar">
            <div className="filter-section">
                <h4 className="filter-title">📂 Chủ đề</h4>
                <ul className="filter-list">
                    <li className="active" onClick={() => onFilterTag('All')}>
                        Tất cả bài tập <span>{totalCount}</span>
                    </li>
                    {tags.map((tag) => (
                        <li key={tag.name} onClick={() => onFilterTag(tag.name)}>
                            {tag.name} <span>{tag.count}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filter-section">
                <h4 className="filter-title">📊 Độ khó</h4>
                <div className="filter-checkbox-group">
                    <label>
                        <input type="checkbox" onChange={(e) => onFilterLevel(e.target.checked ? 'EASY' : 'All')} /> 
                        Dễ
                    </label>
                    <label>
                        <input type="checkbox" onChange={(e) => onFilterLevel(e.target.checked ? 'MEDIUM' : 'All')} /> 
                        Trung bình
                    </label>
                    <label>
                        <input type="checkbox" onChange={(e) => onFilterLevel(e.target.checked ? 'HARD' : 'All')} /> 
                        Khó
                    </label>
                </div>
            </div>

            <button className="filter-submit-btn">Lọc kết quả</button>
        </aside>
    );
};

export default ProblemSidebar;