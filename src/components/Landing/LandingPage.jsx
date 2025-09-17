// components/LandingPage/LandingPage.jsx
import React, { useState } from 'react';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userType, setUserType] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [interests, setInterests] = useState('');
  const [careerSuggestions, setCareerSuggestions] = useState(null);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNotesInput(e.target.result || '');
    };
    reader.readAsText(file);
  };

  const generateQuiz = () => {
    if (!notesInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentQuiz({
        title: 'AI Generated Quiz',
        questions: [
          {
            question: 'Based on your notes, what is the main concept discussed?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
          },
          {
            question: 'Which of the following is a key principle mentioned?',
            options: ['Principle X', 'Principle Y', 'Principle Z', 'None of the above'],
            correctAnswer: 1,
          },
          {
            question: 'What conclusion can be drawn from the material?',
            options: ['Conclusion A', 'Conclusion B', 'Conclusion C', 'All of the above'],
            correctAnswer: 2,
          },
        ],
      });
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResults(false);
      setIsGenerating(false);
    }, 1000);
  };

  const handleQuizAnswer = (index) => {
    if (index === currentQuiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const exploreCareer = () => {
    if (!interests.trim()) return;
    setCareerSuggestions([
      {
        title: 'Software Developer',
        match: '95%',
        description: 'Create applications and systems using programming languages.',
        skills: ['Programming', 'Problem Solving', 'Logic'],
        salary: '$70,000 - $120,000',
        growth: 'High',
      },
      {
        title: 'Data Scientist',
        match: '87%',
        description: 'Analyze complex data to help organizations make decisions.',
        skills: ['Statistics', 'Python', 'Machine Learning'],
        salary: '$80,000 - $140,000',
        growth: 'Very High',
      },
      {
        title: 'UX Designer',
        match: '78%',
        description: 'Design user experiences for digital products.',
        skills: ['Design', 'User Research', 'Prototyping'],
        salary: '$60,000 - $100,000',
        growth: 'High',
      },
    ]);
  };

  const renderNavigation = () => (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>🧠</span>
          <span className={styles.navLogo}>EduPath</span>
        </div>
        
        <div className={styles.desktopNav}>
          {navigationItems.map(item => (
            item.dropdown ? (
              <div key={item.id} className={styles.dropdown}>
                <button className={`${styles.navButton} ${currentPage === item.id ? styles.active : ''}`}>
                  {item.icon} {item.label}
                </button>
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
              </div>
            ) : (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`${styles.navButton} ${currentPage === item.id ? styles.active : ''}`}
              >
                {item.icon} {item.label}
              </button>
            )
          ))}
        </div>

        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileNavContent}>
          {navigationItems.map(item => (
            item.dropdown ? (
              <div key={item.id} className={`${styles.mobileDropdown} ${openDropdown === item.id ? styles.active : ''}`}>
                <button onClick={() => toggleDropdown(item.id)} className={styles.mobileNavButton}>
                  {item.icon} {item.label}
                </button>
                <div className={styles.mobileDropdownMenu}>
                  {item.dropdown.map(subItem => (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        setCurrentPage(subItem.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`${styles.mobileDropdownItem} ${currentPage === subItem.id ? styles.active : ''}`}
                    >
                      {subItem.icon} {subItem.label}
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
                {item.icon} {item.label}
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
                    <button 
                      onClick={() => {
                        setUserType('highschool');
                        setCurrentPage('ai-tools');
                      }} 
                      className={styles.studentCard}
                    >
                      <div className={styles.cardIcon}>🎯</div>
                      <h3 className={styles.cardTitle}>High School Students</h3>
                      <p className={styles.cardText}>AI-powered career exploration and guidance</p>
                    </button>
                    <button 
                      onClick={() => {
                        setUserType('university');
                        setCurrentPage('ai-tools');
                      }} 
                      className={styles.studentCard}
                    >
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
      // Add other cases for different pages
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