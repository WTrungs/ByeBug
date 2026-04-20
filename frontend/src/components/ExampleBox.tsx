
interface ExampleProps{
    id: number;
    input:string;
    output: string;
    explanation?: string;
}
const ExampleBox=({id, input, output, explanation}:ExampleProps)=>(
    <div style={{paddingLeft: '20px'}}>
        <h4>Example {id}:</h4>
        <pre>
            <strong>Input:</strong> {input}<br/>
            <strong>Output:</strong> {output}<br/>
            {explanation && <><strong>Explanation:</strong> {explanation}</>}
        </pre>
    </div>
);
export default ExampleBox;