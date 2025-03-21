import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { useRouter } from 'next/navigation';

/**
 * Header component for the Flight Booking application.
 * Handles navigation and logout functionality.
 * Automatically redirects unauthenticated users to the login page.
 * 
 * @returns {JSX.Element} The rendered header component
 */
const Header: React.FC = () => {
  const { setToken, token } = useAppContext();
  const router = useRouter();

  /**
   * Effect hook to check authentication status on mount and when token changes.
   * Redirects to login page if user is not authenticated and not already on login/signup pages.
   */
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!token && currentPath !== '/login' && currentPath !== '/signup') {
      handleLogout();
    }
  }, [token]);

  /**
   * Handles user logout by clearing authentication token.
   * Removes token from localStorage, updates context state, and redirects to login page.
   */
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('token'); // Remove token from local storage
    }
    setToken(null); // Update context state
    router.push('/login'); // Redirect to login page
  };

  return (
    <header className="flex justify-between items-center p-4 bg-[#2A2C2E] text-white">
      <h1 className="text-xl">Flight Booking</h1>
      <nav>
        <a href="/user-details" className="mr-4">User Details</a>
        <button onClick={handleLogout} className="bg-red-400 rounded hover:opacity[0.4] p-2">Logout</button>
      </nav>
    </header>
  );
};

export default Header;