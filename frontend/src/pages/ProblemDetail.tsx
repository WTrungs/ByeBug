import { useState } from 'react';
import DifficultyBadge from '../components/DifficultyBadge';
import ExampleBox from '../components/ExampleBox';
import TestCaseIcon from '../components/TestCaseIcon';

const ProblemDetail = () => {
  const [code, setCode] = useState('class Solution:\n    def invertTreePath(self, root):');

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#fff' }}>
      
      {/* CỘT BÊN TRÁI: Đề bài */}
      <div>
        <div>
          <DifficultyBadge level="Medium" />
        </div>
        
        <h1 style={{paddingLeft: '20px'}}>Inverted Binary Tree Path</h1>
        
        <p style={{paddingLeft: '20px'}}>
          Given the <code>root</code> of a binary tree, invert the tree, and return the path of the longest branch as an array of integers.
        </p>

        <ExampleBox 
          id={1} 
          input="root = [4,2,7,1,3,6,9]" 
          output="[4,7,9]" 
          explanation="The inverted tree's longest path goes through 4 -> 7 -> 9."
        />

        <div style={{ marginTop: '30px', paddingLeft: '20px' }}>
          <h4>Constraints:</h4>
          <ul style={{paddingLeft: '20px'}}>
            <li>The number of nodes in the tree is in the range [0, 100].</li>
            <li>-100 ≤ Node.val ≤ 100</li>
          </ul>
        </div>
      </div>

      
      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
        
        
        <div style={{ flex: 7, padding: '10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#aaa', fontSize: '13px', paddingBottom: '10px' }}>Solution.py</div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ 
              flex: 1, backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '16px' , border: 'none'
            }} 
          />
        </div>

        <div style={{ backgroundColor: 'GREY', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>TEST CASES</span>
            <span style={{ color: 'WHITE', fontWeight: 'bold' }}>6/8 Passed</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <TestCaseIcon key={i} status={i === 4 || i === 7 ? 'fail' : 'pass'} />)}
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button style={{ padding: '20px',  borderRadius: '25px', cursor: 'pointer' }}>Run Tests</button>
            <button style={{ 
              padding: '20px', borderRadius: '25px', 
              backgroundColor: '#a50538', color: 'white', fontWeight: 'bold', cursor: 'pointer' 
            }}>Submit</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemDetail;