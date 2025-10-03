// components/AITools/AITools.jsx
import React from 'react';
import CareerExplorer from '../CareerExplorer/CareerExplorer';
import QuizGenerator from '../QuizGenerator/QuizGenerator';
import styles from './AITools.module.css';

const AITools = ({ userType }) => {
  return (
    <div className={styles.aiTools}>
      {userType === 'university' ? <QuizGenerator /> : <CareerExplorer />}
    </div>
  );
};

export default AITools;