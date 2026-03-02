import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="navbar" id="navbar">
            <div className="nav-container">
                <a href="#" className="logo">
                    <img src="/assets/logo.png" alt="ExpenseTracker" className="logo-icon" />
                    <span className="logo-text">ExpenseTracker</span>
                </a>
                <div className="nav-buttons">
                    <button
                        className="theme-toggle"
                        id="themeToggle"
                        aria-label="Toggle dark mode"
                        onClick={toggleTheme}
                    >
                        <img src="/assets/icon-sun.png" alt="" className="theme-icon light-icon" />
                        <img src="/assets/icon-moon.png" alt="" className="theme-icon dark-icon" />
                    </button>
                    <div className="user-menu">
                        <button
                            className="user-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(!dropdownOpen);
                            }}
                        >
                            <img src="/assets/icon-user.png" alt="" className="user-avatar" />
                            <span className="user-name">User</span>
                        </button>
                        {dropdownOpen && (
                            <div className="user-dropdown show" onClick={() => setDropdownOpen(false)}>
                                <a href="#" className="dropdown-item">
                                    <img src="/assets/icon-user.png" alt="" />
                                    <span>Profile</span>
                                </a>
                                <a href="#" className="dropdown-item" onClick={(e) => {
                                    e.preventDefault();
                                    localStorage.clear();
                                    window.location.reload();
                                }}>
                                    <img src="/assets/icon-arrow-right.png" alt="" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
