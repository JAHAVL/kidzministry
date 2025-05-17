import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Background from '../Background/Background';
import SearchBar from '../SearchBar/SearchBar';
import './Layout.css';

/**
 * Main layout component that wraps all pages
 * Provides consistent structure with header and footer
 */
const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on the home page - either exactly '/' or undefined path
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  // Debug the current location
  useEffect(() => {
    console.log('Current location path:', location.pathname);
    console.log('Is home page:', isHomePage);
  }, [location.pathname, isHomePage]);

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/policies?search=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <div className="app-layout">
      <Background />
      <Header />
      
      <div className="global-search-container">
        <div className="container">
          <SearchBar
            placeholder="Search policies, procedures, and resources..."
            onSearch={handleSearch}
            showTagline={isHomePage}
          />
        </div>
      </div>
      
      <main className={`main-content ${isHomePage ? 'home-layout' : ''}`}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Redefine Church. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
