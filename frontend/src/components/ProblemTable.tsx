import React from "react";
import { useNavigate } from "react-router-dom";
import type { Problem } from "../api/problemApi"

interface TableProps {
    problems: Problem[]; 
}
const ProblemTable:React.FC<TableProps>=({problems}) =>{
    const navigate=useNavigate();
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
                        <tr key={prob.problemId}>
                            <td>
                                ⚪
                            </td> //chừa lại cho query status

                            <td onClick={()=>navigate('/problems/${prob.problemId}')}
                                style={{cursor:'pointer', color: 'lightblue'}}>
                                {prob.problemId}.{prob.title}
                            </td>
                            <td>
                                {prob.difficulty}
                            </td>
                            <td>
                                {prob.tags?.join(', ')}
                            </td>

                        </tr>
                    ))
                }

            </tbody>


        </table>
    );
};
export default ProblemTable;