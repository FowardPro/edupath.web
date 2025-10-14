// components/LandingPage/LandingPage.jsx
import React, { useState } from 'react';
import {
  Home,
  Users,
  Phone,
  Newspaper,
  UserRound,
  Camera,
  BrainCircuit,
  Target
} from 'lucide-react';

import styles from './LandingPage.module.css';

import AICareerExplorer from '../AITools/AICareerExplorer';
import AIQuizGenerator from '../AITools/AIQuizGenerator';
import AboutPage from '../About/AboutPage';
import ContactPage from '../Contact/ContactPage';
import StaffPage from '../Staff/StaffPage';
import NewsPage from '../News/NewsPage';
import ProgramsPage from '../Programs/ProgramsPage';
import CalendarPage from '../Calendar/CalendarPage';
import PortalPage from '../Portal/PortalPage';
import GalleryPage from '../Gallery/GalleryPage';
import LoginPage from '../Login/LoginPage';

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const Icon = ({ Cmp }) => <Cmp className={styles.navIcon} aria-hidden />;

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Users },
    {
      id: 'connect',
      label: 'Connect',
      icon: Phone,
      dropdown: [
        { id: 'contact', label: 'Contact Us', icon: Phone },
        { id: 'staff', label: 'Staff Directory', icon: Users },
      ]
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Newspaper,
      dropdown: [
        { id: 'news', label: 'News/Announcements', icon: Newspaper },
        { id: 'programs', label: 'Academic Programs', icon: Newspaper },
        { id: 'calendar', label: 'Calendar & Events', icon: Newspaper },
      ]
    },
    { id: 'portal', label: 'Student Portal', icon: UserRound },
    { id: 'gallery', label: 'Photo Gallery', icon: Camera },
    { id: 'ai-tools', label: 'AI Tools', icon: BrainCircuit, badge: true },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handlePortalClick = () => {
    if (isLoggedIn) {
      setCurrentPage('portal');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setCurrentPage('portal');
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const renderNavigation = () => (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <span className={styles.brandIconWrap}><Icon Cmp={BrainCircuit} /></span>
          <span className={styles.navLogo}>EduPath</span>
        </div>

        <div className={styles.desktopNav}>
          {navigationItems.map((item) => (
            item.dropdown ? (
              <div key={item.id} className={styles.dropdown}>
                <button
                  className={`${styles.navButton} ${item.badge ? styles.badge : ''} ${currentPage === item.id ? styles.active : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon Cmp={item.icon} /> {item.label}
                </button>
                <div className={styles.dropdownMenu}>
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setCurrentPage(subItem.id)}
                      className={`${styles.dropdownItem} ${currentPage === subItem.id ? styles.active : ''}`}
                    >
                      <Icon Cmp={subItem.icon} /> {subItem.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item.id}
                onClick={item.id === 'portal' ? handlePortalClick : () => setCurrentPage(item.id)}
                className={`${styles.navButton} ${item.badge ? styles.badge : ''} ${currentPage === item.id ? styles.active : ''}`}
              >
                <Icon Cmp={item.icon} /> {item.label}
              </button>
            )
          ))}
        </div>

        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileNavContent}>
          {navigationItems.map((item) => (
            item.dropdown ? (
              <div key={item.id} className={`${styles.mobileDropdown} ${openDropdown === item.id ? styles.active : ''}`}>
                <button onClick={() => toggleDropdown(item.id)} className={styles.mobileNavButton}>
                  <Icon Cmp={item.icon} /> {item.label}
                </button>
                <div className={styles.mobileDropdownMenu}>
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        setCurrentPage(subItem.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`${styles.mobileDropdownItem} ${currentPage === subItem.id ? styles.active : ''}`}
                    >
                      <Icon Cmp={subItem.icon} /> {subItem.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'portal') {
                    handlePortalClick();
                  } else {
                    setCurrentPage(item.id);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.mobileNavButton} ${currentPage === item.id ? styles.active : ''}`}
              >
                <Icon Cmp={item.icon} /> {item.label}
              </button>
            )
          ))}
        </div>
      </div>
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

                  {/* === TOP TWO AUDIENCE CARDS === */}
                  <div className={styles.audienceGrid}>
                    <button
                      onClick={() => setCurrentPage('ai-career-explorer')}
                      className={styles.audienceCard}
                    >
                      <div className={styles.audienceIconWrap}>
                        <Target aria-hidden />
                      </div>
                      <h3 className={styles.audienceTitle}>High School Students</h3>
                      <p className={styles.audienceText}>
                        AI-powered career exploration and guidance
                      </p>
                    </button>

                    <button
                      onClick={() => setCurrentPage('ai-tools')}
                      className={styles.audienceCard}
                    >
                      <div className={styles.audienceIconWrap}>
                        <BrainCircuit aria-hidden />
                      </div>
                      <h3 className={styles.audienceTitle}>University Students</h3>
                      <p className={styles.audienceText}>
                        AI-generated quizzes from your study notes
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* === THREE FEATURE TILES === */}
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔍</div>
                <h3 className={styles.featureTitle}>Career Discovery</h3>
                <p className={styles.featureText}>
                  Explore careers based on your interests and skills with AI recommendations
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📝</div>
                <h3 className={styles.featureTitle}>Smart Quizzes</h3>
                <p className={styles.featureText}>
                  Upload notes and get AI-generated quizzes to test your knowledge
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>Progress Tracking</h3>
                <p className={styles.featureText}>
                  Monitor your learning journey and career exploration progress
                </p>
              </div>
            </div>
          </div>
        );
      case 'ai-career-explorer':
        return <AICareerExplorer />;
      case 'ai-tools':
        return <AIQuizGenerator />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'staff':
        return <StaffPage />;
      case 'news':
        return <NewsPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'portal':
        return <PortalPage />;
      case 'gallery':
        return <GalleryPage />;
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
      {showLoginModal && (
        <LoginPage onLogin={handleLogin} onClose={handleCloseLogin} />
      )}
    </div>
  );
};

export default LandingPage;
