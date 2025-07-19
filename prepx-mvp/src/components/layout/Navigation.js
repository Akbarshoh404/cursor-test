import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <h2>PrepX</h2>
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/test" className="nav-link">
            Mock Test
          </Link>
          <Link to="/writing" className="nav-link">
            Writing
          </Link>
          <Link to="/resources" className="nav-link">
            Resources
          </Link>
        </div>

        <div className="nav-user">
          <div className="user-menu" onClick={toggleMenu}>
            <div className="user-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{currentUser.name}</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {isMenuOpen && (
            <div className="user-dropdown">
              <div className="dropdown-item user-info">
                <span className="user-email">{currentUser.email}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMenu}>
            Dashboard
          </Link>
          <Link to="/test" className="mobile-nav-link" onClick={toggleMenu}>
            Mock Test
          </Link>
          <Link to="/writing" className="mobile-nav-link" onClick={toggleMenu}>
            Writing
          </Link>
          <Link to="/resources" className="mobile-nav-link" onClick={toggleMenu}>
            Resources
          </Link>
          <div className="mobile-user-info">
            <span>{currentUser.name}</span>
            <span>{currentUser.email}</span>
            <button onClick={handleLogout} className="mobile-logout">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;