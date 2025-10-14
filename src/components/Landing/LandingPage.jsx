// components/LandingPage/LandingPage.jsx
import React, { useState } from 'react';
import { Home, Users, Phone, Newspaper, UserRound, Camera, BrainCircuit } from 'lucide-react';
import styles from './LandingPage.module.css';
import AICareerExplorer from '../AITools/AICareerExplorer';
import AIQuizGenerator from '../AITools/AIQuizGenerator';

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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
                onClick={() => setCurrentPage(item.id)}
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
                  setCurrentPage(item.id);
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
                  <p className={styles.heroSubtitle}>Empowering students with AI-driven career exploration and intelligent study tools</p>
                  <div className={styles.studentCards}>
                    <button onClick={() => setCurrentPage('ai-career-explorer')} className={styles.studentCard}>
                      <div className={styles.cardIcon}>🎯</div>
                      <h3 className={styles.cardTitle}>High School Students</h3>
                      <p className={styles.cardText}>AI-powered career exploration and guidance</p>
                    </button>
                    <button onClick={() => setCurrentPage('ai-tools')} className={styles.studentCard}>
                      <div className={styles.cardIcon}>🧠</div>
                      <h3 className={styles.cardTitle}>University Students</h3>
                      <p className={styles.cardText}>AI-generated quizzes from your study notes</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔍</div>
                <h3 className={styles.featureTitle}>Career Discovery</h3>
                <p className={styles.featureText}>Explore careers based on your interests and skills with AI recommendations</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📝</div>
                <h3 className={styles.featureTitle}>Smart Quizzes</h3>
                <p className={styles.featureText}>Upload notes and get AI-generated quizzes to test your knowledge</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>Progress Tracking</h3>
                <p className={styles.featureText}>Monitor your learning journey and career exploration progress</p>
              </div>
            </div>
          </div>
        );
      case 'ai-career-explorer':
        return <AICareerExplorer />;
      case 'ai-tools':
        return <AIQuizGenerator />;
      case 'about':
        return (
          <div className={styles.aboutPage}>
            <h1>About Us</h1>
            <p>Learn more about EduPath and our mission</p>
          </div>
        );
      case 'contact':
        return (
          <div className={styles.contactPage}>
            <h1>Contact Us</h1>
            <p>Get in touch with our team</p>
          </div>
        );
      case 'staff':
        return (
          <div className={styles.staffPage}>
            <h1>Staff Directory</h1>
            <p>Meet our team members</p>
          </div>
        );
      case 'news':
        return (
          <div className={styles.newsPage}>
            <h1>News & Announcements</h1>
            <p>Latest updates from EduPath</p>
          </div>
        );
      case 'programs':
        return (
          <div className={styles.programsPage}>
            <h1>Academic Programs</h1>
            <p>Explore our educational programs</p>
          </div>
        );
      case 'calendar':
        return (
          <div className={styles.calendarPage}>
            <h1>Calendar & Events</h1>
            <p>Upcoming events and important dates</p>
          </div>
        );
      case 'portal':
        return (
          <div className={styles.portalPage}>
            <h1>Student Portal</h1>
            <p>Access your student dashboard</p>
          </div>
        );
      case 'gallery':
        return (
          <div className={styles.galleryPage}>
            <h1>Photo Gallery</h1>
            <p>View photos from our events and activities</p>
          </div>
        );
      default:
        return (
          <div className={styles.homePage}>
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>Welcome to EduPath</h1>
              <p className={styles.heroSubtitle}>Empowering students with AI-driven career exploration and intelligent study tools</p>
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
