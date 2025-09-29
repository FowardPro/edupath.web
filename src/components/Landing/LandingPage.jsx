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
                <button 
                  className={`${styles.navButton} ${currentPage === item.id ? styles.active : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
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

  const renderAICareerExplorer = () => (
    <div className={styles.aiCareerExplorer}>
      <div className={styles.careerHero}>
        <h1 className={styles.careerTitle}>AI Career Explorer</h1>
        <p className={styles.careerSubtitle}>
          Discover your ideal career path with AI-powered recommendations
        </p>
      </div>
      
      <div className={styles.careerContent}>
        <div className={styles.interestsSection}>
          <h2 className={styles.sectionTitle}>Tell us about your interests</h2>
          <p className={styles.sectionDescription}>
            Describe your interests, skills, and what you enjoy doing...
          </p>
          
          <div className={styles.inputContainer}>
            <textarea
              className={styles.interestsInput}
              placeholder="Example: I enjoy solving problems, working with technology, and creative thinking. I'm good at math and science..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              rows={6}
            />
          </div>
          
          <button 
            className={styles.exploreButton}
            onClick={exploreCareer}
            disabled={!interests.trim()}
          >
            Explore Career Paths
          </button>
        </div>
        
        {careerSuggestions && (
          <div className={styles.suggestionsSection}>
            <h2 className={styles.suggestionsTitle}>Career Suggestions</h2>
            <div className={styles.suggestionsGrid}>
              {careerSuggestions.map((career, index) => (
                <div key={index} className={styles.careerCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.careerCardTitle}>{career.title}</h3>
                    <span className={styles.matchBadge}>{career.match} Match</span>
                  </div>
                  <p className={styles.careerDescription}>{career.description}</p>
                  <div className={styles.skillsSection}>
                    <h4 className={styles.skillsTitle}>Key Skills:</h4>
                    <div className={styles.skillsList}>
                      {career.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.careerDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Salary Range:</span>
                      <span className={styles.detailValue}>{career.salary}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Growth Potential:</span>
                      <span className={styles.detailValue}>{career.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAIStudyTools = () => (
    <div className={styles.aiToolsPage}>
      <div className={styles.toolsHero}>
        <h1 className={styles.toolsTitle}>AI Study Tools</h1>
        <p className={styles.toolsSubtitle}>
          Upload your study notes and generate AI-powered quizzes to test your knowledge
        </p>
      </div>
      
      <div className={styles.toolsContent}>
        <div className={styles.uploadSection}>
          <h2 className={styles.sectionTitle}>Upload Your Notes</h2>
          <p className={styles.sectionDescription}>
            Upload text files or paste your study notes below to generate quizzes
          </p>
          
          <div className={styles.uploadArea}>
            <input
              type="file"
              accept=".txt,.md,.docx"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>📁</div>
              <span>Choose a file or drag and drop here</span>
              <span className={styles.uploadHint}>Text files only (.txt, .md, .docx)</span>
            </label>
          </div>
          
          <div className={styles.textAreaContainer}>
            <textarea
              className={styles.notesInput}
              placeholder="Or paste your notes here directly..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              rows={8}
            />
          </div>
          
          <button 
            className={styles.generateButton}
            onClick={generateQuiz}
            disabled={!notesInput.trim() || isGenerating}
          >
            {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>
        
        {currentQuiz && !showResults && (
          <div className={styles.quizSection}>
            <h2 className={styles.quizTitle}>{currentQuiz.title}</h2>
            <div className={styles.quizProgress}>
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </div>
            <div className={styles.questionCard}>
              <h3 className={styles.questionText}>
                {currentQuiz.questions[currentQuestionIndex].question}
              </h3>
              <div className={styles.optionsGrid}>
                {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={styles.optionButton}
                    onClick={() => handleQuizAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {showResults && (
          <div className={styles.resultsSection}>
            <h2 className={styles.resultsTitle}>Quiz Results</h2>
            <div className={styles.scoreCard}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreText}>
                  {score} / {currentQuiz.questions.length}
                </span>
                <span className={styles.scorePercentage}>
                  {Math.round((score / currentQuiz.questions.length) * 100)}%
                </span>
              </div>
              <p className={styles.scoreMessage}>
                {score === currentQuiz.questions.length ? 'Excellent! Perfect score!' :
                 score >= currentQuiz.questions.length / 2 ? 'Good job! Keep practicing!' :
                 'Keep studying! You\'ll get better!'}
              </p>
              <button 
                className={styles.retryButton}
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setShowResults(false);
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
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
                        setCurrentPage('ai-career-explorer');
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
      
      case 'ai-career-explorer':
        return renderAICareerExplorer();
      
      case 'ai-tools':
        return renderAIStudyTools();
      
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