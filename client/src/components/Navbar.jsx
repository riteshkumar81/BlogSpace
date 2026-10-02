import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <span className="brand-mark">B</span>
          <span className="brand-text">
            <span className="brand-blog">Blog</span>
            <span className="brand-space">Space</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </> 
          ) : (
            <> 
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="cta-button">Get Started</Link>
            </> 
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;