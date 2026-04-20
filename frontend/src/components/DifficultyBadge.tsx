

const DifficultyBadge=({level}:{level:string})=>{
    const color: any = {
        'Dễ': 'green',
        'Trung bình': 'yellow',
        'Khó': 'red'
    };
    return(
        <span style={{paddingLeft: '20px'}}>
            {level}
        </span>
    );
};
export default DifficultyBadge;