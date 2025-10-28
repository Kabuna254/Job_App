import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
            localStorage.getItem('darkMode') !== 'false');
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      alert("Account deleted successfully");
      navigate("/register");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="flex items-center w-full">
        <Link to="/" className="navbar-brand" onClick={closeMenus}>JobBoard</Link>
        
        {/* Mobile menu button */}
        <button 
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        {/* Job Seeker Navigation */}
        {user?.role === 'seeker' && (
          <>
            <div className="nav-dropdown">
              <button 
                className="nav-link dropdown-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Find Jobs ▼
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/jobBrowser" className="dropdown-item" onClick={closeMenus}>
                    Browse All Jobs
                  </Link>
                  <Link to="/jobs/technology" className="dropdown-item" onClick={closeMenus}>
                    Technology Jobs
                  </Link>
                  <Link to="/jobs/finance" className="dropdown-item" onClick={closeMenus}>
                    Finance Jobs
                  </Link>
                  <Link to="/jobs/healthcare" className="dropdown-item" onClick={closeMenus}>
                    Healthcare Jobs
                  </Link>
                  <Link to="/jobs/remote" className="dropdown-item" onClick={closeMenus}>
                    Remote Jobs
                  </Link>
                </div>
              )}
            </div>
            
            <div className="nav-dropdown">
              <button className="nav-link dropdown-trigger">
                Career Resources ▼
              </button>
              <div className="dropdown-menu">
                <Link to="/career-advice" className="dropdown-item" onClick={closeMenus}>
                  Career Advice
                </Link>
                <Link to="/resume-builder" className="dropdown-item" onClick={closeMenus}>
                  Resume Builder
                </Link>
                <Link to="/interview-tips" className="dropdown-item" onClick={closeMenus}>
                  Interview Tips
                </Link>
                <Link to="/salary-guide" className="dropdown-item" onClick={closeMenus}>
                  Salary Guide
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Employer Navigation */}
        {user?.role === 'employer' && (
          <>
            <div className="nav-dropdown">
              <button className="nav-link dropdown-trigger">
                For Employers ▼
              </button>
              <div className="dropdown-menu">
                <Link to="/create-job" className="dropdown-item" onClick={closeMenus}>
                  Post a Job
                </Link>
                <Link to="/manage-jobs" className="dropdown-item" onClick={closeMenus}>
                  Manage Jobs
                </Link>
                <Link to="/applications" className="dropdown-item" onClick={closeMenus}>
                  View Applications
                </Link>
                <Link to="/candidate-search" className="dropdown-item" onClick={closeMenus}>
                  Search Candidates
                </Link>
              </div>
            </div>
            
            <div className="nav-dropdown">
              <button className="nav-link dropdown-trigger">
                Resources ▼
              </button>
              <div className="dropdown-menu">
                <Link to="/hiring-guide" className="dropdown-item" onClick={closeMenus}>
                  Hiring Guide
                </Link>
                <Link to="/pricing" className="dropdown-item" onClick={closeMenus}>
                  Pricing Plans
                </Link>
                <Link to="/employer-support" className="dropdown-item" onClick={closeMenus}>
                  Support
                </Link>
              </div>
            </div>
          </>
        )}

        {/* General Navigation */}
        <Link 
          to="/jobBrowser" 
          className="nav-link"
          onClick={closeMenus}
        >
          Browse Jobs
        </Link>

        <Link 
          to="/companies" 
          className="nav-link"
          onClick={closeMenus}
        >
          Companies
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="nav-button nav-button-darkmode"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div className="nav-dropdown">
            <button className="nav-link dropdown-trigger">
              {user.name || user.email} ▼
            </button>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item" onClick={closeMenus}>
                My Profile
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={closeMenus}>
                Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenus();
                }}
                className="dropdown-item logout-item"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  handleDeleteAccount();
                  closeMenus();
                }}
                className="dropdown-item delete-item"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link 
              to="/login" 
              className="nav-link"
              onClick={closeMenus}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="nav-button nav-button-primary"
              onClick={closeMenus}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;