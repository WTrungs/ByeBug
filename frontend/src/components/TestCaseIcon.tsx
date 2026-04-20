const TestCaseIcon=({status}: {status: 'pass'|'fail'| 'pending'}) => {
    const bgColor=status === 'pass'?'green':status==='fail'?'red':'yellow';
    return (
        <div style={{
            width: '24px', height: '24px',
            backgroundColor: bgColor, alignItems:'center',
            color:'white', justifyContent: 'center', display: 'flex'
        }}>
            {status==='pass'?'✓':status==='fail'?'✕':''}
        </div>
    );
};
export default TestCaseIcon;