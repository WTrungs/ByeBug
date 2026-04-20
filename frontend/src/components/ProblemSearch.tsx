import React from "react";
interface SearchProps{
    onSearch: (term:string)=>void;
    onFilter: (level:string)=>void;
}
const ProblemSearch:React.FC<SearchProps>=({onSearch, onFilter}:SearchProps) =>{
    return(
        <div style={{display:'flex', gap:'15px'}}>
            <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            style={{padding:'10px', color: 'red'}}
            onChange={(e)=>onSearch(e.target.value)}
            />
            <select
                style={{padding: '10px'}}
                onChange={(e) => {
                    console.log("Giá trị chọn tại Search:", e.target.value);
                    onFilter(e.target.value)}}>
                <option value="All">Tất cả</option>
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
            </select>
        </div>
    );
};
export default ProblemSearch;