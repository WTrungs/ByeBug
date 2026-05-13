import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      gap: '20px',
      padding: '15px 20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e4e7',
      alignItems: 'center'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#aa3bff', marginRight: 'auto' }}>
        ByeBug
      </div>

      {/*chuyển trang bằng link */}
      <Link to="/problems" style={{ textDecoration: 'none', color: '#6b6375' }}>Problems</Link>
      <Link to="/ranking" style={{ textDecoration: 'none', color: '#6b6375' }}>Ranking</Link>
      <Link to="/profile/me" style={{ textDecoration: 'none', color: '#6b6375' }}>Profile</Link>
      <Link to="/settings" style={{ textDecoration: 'none', color: '#6b6375' }}>Settings</Link>

      <Link to="/login" style={{
        padding: '8px 16px',
        borderRadius: '6px',
        backgroundColor: 'purple',
        color: '#fff',
        textDecoration: 'none'
      }}>Logout</Link>
    </nav>
  );
};

export default Navbar;