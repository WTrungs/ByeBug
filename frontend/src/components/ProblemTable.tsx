import React from "react";

interface Problem{
    id: number;
    title: string;
    difficulty:string;
    category: string;
    status: string;
}
interface TableProps {
    problems: Problem[]; // Chỗ này phải khớp với tên biến bên dưới
}
const ProblemTable:React.FC<TableProps>=({problems}) =>{
    return (
        <table style = {{width:'100%'}}>
            <thead>
                <tr style={{color: 'green'}}>
                    <th style={{padding:'10px'}}>Trạng thái</th>
                    <th style={{padding:'10px'}}>Tiêu đề</th>
                    <th style={{padding:'10px'}}>Độ khó</th>
                    <th style={{padding:'10px'}}>Chủ đề</th>
                </tr>
            </thead>
            <tbody>
                {problems.map((prob)=>(
                        <tr key={prob.id}>
                            <td>
                                {prob.status==='Done'?'✅' : '⚪'}
                            </td>

                            <td>
                                {prob.id}.{prob.title}
                            </td>
                            <td>
                                {prob.difficulty}
                            </td>
                            <td>
                                {prob.category}
                            </td>

                        </tr>
                    ))
                }

            </tbody>


        </table>
    );
};
export default ProblemTable;