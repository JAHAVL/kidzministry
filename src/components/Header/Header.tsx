import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { PATHS } from '../../utils/pathconfig';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

const Header: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <header className={`app-header ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-container">
        <div className="theme-toggle">
          <button 
            onClick={toggleTheme} 
            className="theme-button"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun size={32} /> : <FiMoon size={32} />}
          </button>
        </div>
        
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <h1>Redefine Kidz</h1>
          </Link>
        </div>
        
        <div className="menu-toggle">
          <button 
            onClick={toggleMenu} 
            className="menu-button"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FiX size={36} /> : <FiMenu size={36} />}
          </button>
        </div>
      </div>
      
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to={PATHS.HOME} onClick={toggleMenu}>Home</Link></li>
          <li><Link to={PATHS.POLICIES} onClick={toggleMenu}>Policies</Link></li>
          <li><Link to={PATHS.PROCEDURES} onClick={toggleMenu}>Procedures</Link></li>
          <li><Link to={PATHS.RESOURCES} onClick={toggleMenu}>Resources</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
