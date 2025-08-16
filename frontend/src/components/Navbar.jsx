import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'sonner';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out.");
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/transactions" className="text-2xl font-bold">Budget Tracker</Link>
      <div>
        {user ? (
          <>
            <Link to="/transactions" className="mr-4">Transactions</Link>
            <Link to="/budgets" className="mr-4">Budgets</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      <Toaster />
      </div>
    </nav>
  );
};

export default Navbar;
