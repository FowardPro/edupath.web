// components/AICareerExplorer/AICareerExplorer.jsx
import React, { useState } from 'react';
import styles from './AICareerExplorer.module.css';

const AICareerExplorer = () => {
  const [interests, setInterests] = useState('');
  const [careerSuggestions, setCareerSuggestions] = useState(null);

  const exploreCareer = () => {
    if (!interests.trim()) return;
    
    // Mock data - in a real app, this would come from an API
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

  return (
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
                    <h3 className={styles.careerTitle}>{career.title}</h3>
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
};

export default AICareerExplorer;