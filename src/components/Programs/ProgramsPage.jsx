import React from 'react';
import styles from './ProgramsPage.module.css';

const ProgramsPage = () => {
  const programs = [
    {
      title: 'AI Career Exploration',
      description: 'For high school students to discover careers using AI-powered recommendations based on their interests and skills.',
      target: 'High School Students',
      duration: 'Self-paced',
      image: '🎯'
    },
    {
      title: 'Smart Study Tools',
      description: 'University students can transform their notes into interactive quizzes and enhance their learning experience.',
      target: 'University Students',
      duration: 'Ongoing',
      image: '📚'
    },
    {
      title: 'Teacher Professional Development',
      description: 'Training programs for educators to integrate AI tools into their teaching methodologies.',
      target: 'Educators',
      duration: '6 months',
      image: '👨‍🏫'
    },
    {
      title: 'School Partnership Program',
      description: 'Collaborative programs with schools to implement EduPath tools across their curriculum.',
      target: 'Schools & Districts',
      duration: 'Academic Year',
      image: '🏫'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Academic Programs</h1>
        <div className={styles.grid}>
          {programs.map((program, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.image}>{program.image}</div>
              <h3 className={styles.cardTitle}>{program.title}</h3>
              <p className={styles.description}>{program.description}</p>
              <div className={styles.details}>
                <span className={styles.target}>Target: {program.target}</span>
                <span className={styles.duration}>Duration: {program.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
