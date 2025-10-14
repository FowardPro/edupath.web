import React, { useState } from 'react';
import styles from './AIQuizGenerator.module.css';

const AIQuizGenerator = () => {
  const [notesInput, setNotesInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

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

  return (
    <div className={styles.aiToolsPage}>
      <div className={styles.toolsHero}>
        <h1 className={styles.toolsTitle}>AI Quiz Generator</h1>
        <p className={styles.toolsSubtitle}>
          Upload or paste your study notes to generate custom quizzes
        </p>
      </div>

      <div className={styles.toolsContent}>
        {!currentQuiz ? (
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
        ) : !showResults ? (
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
        ) : (
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
              <button
                className={styles.newQuizButton}
                onClick={() => {
                  setCurrentQuiz(null);
                  setNotesInput('');
                }}
              >
                Generate New Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuizGenerator;
