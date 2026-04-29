import { useState, useEffect } from 'react'; 
import ProblemSearch from '../components/ProblemSearch';
import ProblemTable from '../components/ProblemTable';
import Pagination from '../components/Pagination';
import { getAllProblems } from '../api/problemApi';
import type { Problem } from '../api/problemApi';

const Problems = () => {
    const [allProblems, setAllProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    const problemsPerPage = 4;

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const data = await getAllProblems();
            setAllProblems(data);
            setError(''); // Xóa lỗi cũ nếu có
        } catch (err) {
            console.error("Lỗi API:", err);
            setError('Không thể tải danh sách bài tập! Kiểm tra lại Backend đi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []); 
    
    const filtered: Problem[] = allProblems.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterLevel === 'All' || p.difficulty === filterLevel)
    );

    const currentProblems = filtered.slice(
        (currentPage - 1) * problemsPerPage, 
        currentPage * problemsPerPage
    );

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h3>Đang tải dữ liệu từ server...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>
                <h3>{error}</h3>
                <button onClick={fetchProblems}>Thử lại</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Problems</h1>
            
        
            <ProblemSearch 
                onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
                onFilter={(val) => { setFilterLevel(val); setCurrentPage(1); }}
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