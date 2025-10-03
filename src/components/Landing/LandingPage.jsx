// components/Landing/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = ({ isLoggedIn }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About Us', icon: '👥' },
    {
      id: 'connect',
      label: 'Connect',
      icon: '📞',
      dropdown: [
        { id: 'contact', label: 'Contact Us', icon: '📞' },
        { id: 'staff', label: 'Staff Directory', icon: '👥' },
      ]
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: '📰',
      dropdown: [
        { id: 'news', label: 'News/Announcements', icon: '📰' },
        { id: 'programs', label: 'Academic Programs', icon: '📚' },
        { id: 'calendar', label: 'Calendar & Events', icon: '📅' },
      ]
    },
    { id: 'portal', label: 'Student Portal', icon: '👤' },
    { id: 'gallery', label: 'Photo Gallery', icon: '📷' },
    { id: 'ai-tools', label: 'AI Tools', icon: '🧠' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleProtectedClick = (pageId) => {
    if (!isLoggedIn && pageId !== 'home') {
      navigate("/login");
    } else {
      setCurrentPage(pageId);
    }
  };

  const renderNavigation = () => (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>🧠</span>
          <span className={styles.navLogo}>EduPath</span>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navigationItems.map(item => (
            item.dropdown ? (
              <div key={item.id} className={styles.dropdown}>
                <button
                  onClick={() => handleProtectedClick(item.id)}
                  className={`${styles.navButton} ${!isLoggedIn ? styles.locked : ''} ${currentPage === item.id ? styles.active : ''}`}
                >
                  {item.icon} {item.label}
                </button>
                {isLoggedIn && (
                  <div className={styles.dropdownMenu}>
                    {item.dropdown.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={() => setCurrentPage(subItem.id)}
                        className={`${styles.dropdownItem} ${currentPage === subItem.id ? styles.active : ''}`}
                      >
                        {subItem.icon} {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.id}
                onClick={() => handleProtectedClick(item.id)}
                className={`${styles.navButton} ${!isLoggedIn && item.id !== 'home' ? styles.locked : ''} ${currentPage === item.id ? styles.active : ''}`}
              >
                {item.icon} {item.label}
              </button>
            )
          ))}

          {/* Login / Logout button right after AI Tools */}
          {isLoggedIn ? (
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className={styles.loginBtn}
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => navigate("/login")} 
              className={styles.loginBtn}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={styles.mobileNav}>
          <div className={styles.mobileNavContent}>
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  handleProtectedClick(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.mobileNavButton} ${currentPage === item.id ? styles.active : ''}`}
              >
                {item.icon} {item.label}
              </button>
            ))}

            {/* Login / Logout button for mobile */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className={styles.loginBtn}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className={styles.loginBtn}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className={styles.homePage}>
            <div className={styles.heroSection}>
              <div className={styles.heroOverlay}></div>
              <div className={styles.heroContent}>
                <div className={styles.heroText}>
                  <h1 className={styles.heroTitle}>Welcome to EduPath</h1>
                  <p className={styles.heroSubtitle}>
                    Empowering students with AI-driven career exploration and intelligent study tools
                  </p>
                  <div className={styles.studentCards}>
                    <button 
                      onClick={() => handleProtectedClick('ai-tools')}
                      className={`${styles.studentCard} ${!isLoggedIn ? styles.locked : ''}`}
                    >
                      <div className={styles.cardIcon}>🎯</div>
                      <h3 className={styles.cardTitle}>High School Students</h3>
                      <p className={styles.cardText}>AI-powered career exploration and guidance</p>
                    </button>
                    <button 
                      onClick={() => handleProtectedClick('ai-tools')}
                      className={`${styles.studentCard} ${!isLoggedIn ? styles.locked : ''}`}
                    >
                      <div className={styles.cardIcon}>🧠</div>
                      <h3 className={styles.cardTitle}>University Students</h3>
                      <p className={styles.cardText}>AI-generated quizzes from your study notes</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.homePage}>
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>Welcome to EduPath</h1>
              <p className={styles.heroSubtitle}>
                Empowering students with AI-driven career exploration and intelligent study tools
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      {renderNavigation()}
      {renderPageContent()}
    </div>
  );
};

export default LandingPage;
