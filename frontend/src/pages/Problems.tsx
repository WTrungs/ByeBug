import { useState } from 'react';
import ProblemSearch from '../components/ProblemSearch';
import ProblemTable from '../components/ProblemTable';
import Pagination from '../components/Pagination';

interface Problem{
    id: number;
    title: string;
    difficulty:string;
    category: string;
    status: string;
}

const Problems =() =>{
    const[allProblems]=useState <Problem[]>([
        { id: 1, title: "Two Sum", difficulty: "Dễ", category: "Array", status: "Done" },
    { id: 2, title: "Reverse String", difficulty: "Dễ", category: "String", status: "Todo" },
    { id: 3, title: "Median Array", difficulty: "Khó", category: "Binary Search", status: "Todo" },
    { id: 4, title: "Add Two Numbers", difficulty: "Trung bình", category: "Linked List", status: "Todo" },
    { id: 5, title: "Longest Substring", difficulty: "Trung bình", category: "Hash Table", status: "Done" },
    { id: 6, title: "Palindrome Number", difficulty: "Dễ", category: "Math", status: "Todo" },
    { id: 7, title: "Regular Expression", difficulty: "Khó", category: "Dynamic Programming", status: "Todo" },
    { id: 8, title: "Container With Water", difficulty: "Trung bình", category: "Two Pointers", status: "Todo" },

    ]);
    const [searchTerm, setSearchTerm]=useState('');
    const[filterLevel, setFilterLevel]=useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 4;


    const filtered: Problem[] = allProblems.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLevel === 'All' || p.difficulty === filterLevel)
    );

    const currentProblems = filtered.slice((currentPage-1)*problemsPerPage, currentPage*problemsPerPage);
    const totalPages=Math.ceil(filtered.length / problemsPerPage);

    return(
        <div>
            <h1>Problems</h1>
            <ProblemSearch 
                onSearch={(val) => {setSearchTerm(val); setCurrentPage(1); }} 
                onFilter={(val) => {setFilterLevel(val); setCurrentPage(1); }}
                />
            <ProblemTable problems={currentProblems} />

            <Pagination
                currentPage={currentPage}
                totalProblems={filtered.length}
                problemsPerPage={problemsPerPage}
                onPageChange={setCurrentPage}
                />

            
        </div>
        
    );
};
export default Problems;