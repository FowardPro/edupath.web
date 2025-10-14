import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styles from './AIQuizGenerator.module.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

const AIQuizGenerator = () => {
  const [notesInput, setNotesInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNotesInput(e.target.result || '');
    };
    reader.readAsText(file);
  };

  const generateQuiz = async () => {
    if (!notesInput.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Based on the following study notes, generate a quiz with 5 multiple-choice questions. Each question should have 4 options (A, B, C, D) and one correct answer. Format the response as a JSON object with keys: title (string), questions (array of objects with keys: question (string), options (array of 4 strings), correctAnswer (index 0-3)).

Notes: "${notesInput}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const parsedQuiz = JSON.parse(text);
      setCurrentQuiz(parsedQuiz);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResults(false);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

            {error && (
              <div className={styles.error}>
                <p>{error}</p>
                <button onClick={() => setError(null)}>Try Again</button>
              </div>
            )}
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
