import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { setToken, token } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!token && currentPath !== '/login' && currentPath !== '/signup') {
      handleLogout();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken(null); // Update context state
    router.push('/login'); // Redirect to login page
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl">Flight Booking</h1>
      <nav>
        <a href="/user-details" className="mr-4">User Details</a>
        <button onClick={handleLogout} className="bg-red-500 p-2 rounded">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
