import { Link } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <nav className="bg-red-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          LifeShare
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-red-200">Home</Link>
          {user && (
            <Link to="/dashboard" className="hover:text-red-200">Dashboard</Link>
          )}
          <Link to="/donor-registration" className="hover:text-red-200">Become a Donor</Link>
          <Link to="/request-transplant" className="hover:text-red-200">Request Transplant</Link>
          {/* <Link to="/about" className="hover:text-red-200">About</Link> */}
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className="hover:text-red-200">Admin Dashboard</Link>
          )}
          
          {user ? (
            <button 
              onClick={handleLogout} 
              className="hover:text-red-200"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-red-200">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
