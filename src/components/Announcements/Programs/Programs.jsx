import React from 'react'
import styles from './Programs.module.css';
const Programs = () => {

  const programsData = [
    {
      icon: "🎓",
      title: "Career Exploration Program",
      description: "Comprehensive career guidance using AI-powered assessments and personalized recommendations.",
      features: [
        'Interest and skills assessment',
        'Career matching algorithms',
        'College program recommendations',
        'Industry insights and trends',
        'One-on-one career counseling',
        'Job market analysis'
      ],

    },
    {
      icon: "🤖",
      title: "AI Literacy Certification",
      description: "A program designed to enhance understanding of AI technologies and their applications.",
      features: [
        'Introduction to AI concepts',
        'Hands-on AI toolkits',
        'Ethics in AI',
        'AI in the workplace',
        'Future of AI technologies'
      ],

    },
    {
      icon: "📝",
      title: "AI Quiz Generator",
      description: "A tool for creating customized quizzes using AI.",
      features: [
        'Dynamic question generation',
        'Real-time feedback',
        'Performance analytics',
        'Integration with learning management systems',
        'Support for various question formats'
      ],

    },
    {
      icon: "📚",
      title: "Personalized Learning Paths",
      description: "Customized learning experiences tailored to individual student needs.",
      features: [
        'Adaptive learning technologies',
        'Personalized content recommendations',
        'Progress tracking and analytics',
        'Integration with existing curricula',
        'Support for diverse learning styles'
      ],

    }
  ];

  return (
    <div className={styles.programsContainer}>
      <div className={styles.programsHeader}>
        <h2 className={styles.programsTitle}>Our Programs</h2>
      </div>
      <div className={styles.programsGrid}>
        {programsData.map((program, index) => (
          <div key={index} className={styles.programCard}>
            <h3 className={styles.programTitle}>{program.icon} {program.title}</h3>
            <p className={styles.programDescription}>{program.description}</p>
            <h4 className={styles.programFeaturesTitle}>Features:</h4>
            <ul className={styles.programFeaturesList}>
              {program.features.map((feature, featureIndex) => (
                <li key={featureIndex} className={styles.programFeatureItem}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Programs;