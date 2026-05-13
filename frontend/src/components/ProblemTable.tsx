import React from "react";
import { useNavigate } from "react-router-dom";
import type { Problem } from "../api/problemApi";
import DifficultyBadge from "./DifficultyBadge";

interface TableProps {
    problems: Problem[];
}

const ProblemTable: React.FC<TableProps> = ({ problems }) => {
    const navigate = useNavigate();
    const getTagName = (tag: Problem['tags'][number]) =>
        typeof tag === 'string' ? tag : tag.tagName;

    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr style={{ color: 'green' }}>
                    <th style={{ padding: '10px' }}>Trạng thái</th>
                    <th style={{ padding: '10px' }}>Tiêu đề</th>
                    <th style={{ padding: '10px' }}>Độ khó</th>
                    <th style={{ padding: '10px' }}>Chủ đề</th>
                </tr>
            </thead>
            <tbody>
                {problems.map((prob) => (
                    <tr key={prob.problemId}>
                        <td>⚪</td>
                        <td
                            onClick={() => navigate(`/problems/${prob.problemId}`)}
                            style={{ cursor: 'pointer', color: 'lightblue' }}
                        >
                            {prob.problemId}.{prob.title}
                        </td>
                        <td>
                            <DifficultyBadge level={prob.difficulty} />
                        </td>
                        <td>
                            {prob.tags?.map(getTagName).join(', ')}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProblemTable;
