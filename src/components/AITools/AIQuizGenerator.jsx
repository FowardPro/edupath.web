import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import styles from './AIQuizGenerator.module.css';

// PDF & DOCX helpers
import * as pdfjsLib from 'pdfjs-dist/webpack';
import mammoth from 'mammoth';

// Set up the PDF.js worker (required)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const AIQuizGenerator = () => {
  const [notesInput, setNotesInput] = useState(''); // extracted or pasted text
  const [imageInline, setImageInline] = useState(null); // { mimeType, data } for images
  const [fileName, setFileName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Key lives in this file (as requested). Don’t ship to prod like this.
  const API_KEY = 'AIzaSyAmpiNC6GB9vwIAP0oz8JS0On8iKETxX8Q';

  // ---------- File extractors ----------
  const readAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const readAsArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const readAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const extractTextFromPDF = async (file) => {
    const buf = await readAsArrayBuffer(file);
    const typedArray = new Uint8Array(buf);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    const pageTexts = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(it => it.str).join(' ');
      pageTexts.push(text);
    }
    return pageTexts.join('\n');
  };

  const extractTextFromDocx = async (file) => {
    const buf = await readAsArrayBuffer(file);
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return value || '';
  };

  // Utility: convert dataURL → {mimeType, base64}
  const dataURLToInline = (dataURL) => {
    const comma = dataURL.indexOf(',');
    const meta = dataURL.slice(0, comma);       // data:image/png;base64
    const data = dataURL.slice(comma + 1);      // base64 data
    const mimeMatch = meta.match(/^data:(.*?);base64$/i);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    return { mimeType, data };
  };

  // ---------- Upload Handler ----------
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError(null);
    setFileName(file.name);

    try {
      // Reset previous image/text
      setImageInline(null);
      setNotesInput('');

      const mime = file.type || '';
      const ext = (file.name.split('.').pop() || '').toLowerCase();

      // Images (let Gemini look at the picture)
      if (mime.startsWith('image/')) {
        const dataURL = await readAsDataURL(file);
        setImageInline(dataURLToInline(dataURL));
        setNotesInput(''); // optional: leave empty; model will use image
        return;
      }

      // PDFs → extract text locally
      if (mime === 'application/pdf' || ext === 'pdf') {
        const text = await extractTextFromPDF(file);
        if (!text.trim()) throw new Error('No text detected in the PDF.');
        setNotesInput(text);
        return;
      }

      // DOCX → extract text via mammoth
      if (
        mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        ext === 'docx'
      ) {
        const text = await extractTextFromDocx(file);
        if (!text.trim()) throw new Error('No text detected in the DOCX.');
        setNotesInput(text);
        return;
      }

      // Plain text / Markdown
      if (
        mime === 'text/plain' || mime === 'text/markdown' ||
        ext === 'txt' || ext === 'md'
      ) {
        const text = await readAsText(file);
        if (!text.trim()) throw new Error('This text file appears empty.');
        setNotesInput(text);
        return;
      }

      // Fallback: try to read as text; if binary, ask user to upload supported type
      try {
        const text = await readAsText(file);
        if (text && text.trim().length > 0) {
          setNotesInput(text);
        } else {
          throw new Error('Unsupported file type. Please upload pdf/docx/txt/md or an image.');
        }
      } catch {
        throw new Error('Unsupported file type. Please upload pdf/docx/txt/md or an image.');
      }
    } catch (err) {
      console.error('Upload/parse error:', err);
      setError(err.message || 'Failed to read the file.');
    }
  };

  // ---------- JSON helpers ----------
  const safeParseJson = (txt) => {
    try {
      return JSON.parse(txt);
    } catch {
      const m = txt.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (m) return JSON.parse(m[1]);
      throw new Error('The AI response was not valid JSON.');
    }
  };

  const validateQuiz = (q) => {
    if (!q || typeof q !== 'object') throw new Error('Malformed quiz payload.');
    if (!Array.isArray(q.questions) || !q.questions.length) throw new Error('Quiz has no questions.');
    q.questions.forEach((it, i) => {
      if (!it || typeof it !== 'object') throw new Error(`Question ${i + 1} is malformed.`);
      if (!Array.isArray(it.options) || it.options.length !== 4) throw new Error(`Question ${i + 1} must have exactly 4 options.`);
      if (typeof it.correctAnswer !== 'number' || it.correctAnswer < 0 || it.correctAnswer > 3) {
        throw new Error(`Question ${i + 1} has an invalid correctAnswer index.`);
      }
      if (typeof it.question !== 'string' || !it.question.trim()) {
        throw new Error(`Question ${i + 1} is missing text.`);
      }
    });
    return q;
  };

  // ---------- Generate Quiz ----------
  const generateQuiz = async () => {
    // Allow either: extracted text OR an image (or both)
    if (!notesInput.trim() && !imageInline) {
      setError('Please upload a file or paste some notes first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      if (!API_KEY) throw new Error('API key missing.');

      const ai = new GoogleGenAI({ apiKey: API_KEY, apiVersion: 'v1' });

      // Build multimodal parts:
      const parts = [];
      // text context (optional but helpful)
      if (notesInput.trim()) {
        parts.push({
          text:
`You are a helpful tutor. Create a concise multiple-choice quiz from the provided material.

Requirements:
- 5 questions total.
- Each question has exactly 4 options (A, B, C, D).
- Provide the correct answer as a 0-3 index (0=A, 1=B, 2=C, 3=D).
- Return ONLY JSON (no prose) with this exact shape:

{
  "title": string,
  "questions": [
    {"question": string, "options": [string, string, string, string], "correctAnswer": 0|1|2|3}
  ]
}

Material (text):
${notesInput}`
        });
      } else {
        // No text, but we have an image — guide the model for OCR/understanding
        parts.push({
          text:
`You are a helpful tutor. Read the attached image and extract key facts.
Create a concise multiple-choice quiz from what you see.

Requirements:
- 5 questions total.
- Each question has exactly 4 options (A, B, C, D).
- Provide the correct answer as a 0-3 index (0=A, 1=B, 2=C, 3=D).
- Return ONLY JSON (no prose) with this exact shape:

{
  "title": string,
  "questions": [
    {"question": string, "options": [string, string, string, string], "correctAnswer": 0|1|2|3}
  ]
}`
        });
      }

      // add image if present
      if (imageInline) {
        parts.push({
          inlineData: {
            mimeType: imageInline.mimeType,
            data: imageInline.data, // base64 only (no prefix)
          }
        });
      }

      const res = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: [{ role: 'user', parts }],
        config: { response_mime_type: 'application/json' },
      });

      const parsed = safeParseJson(res.text);
      const quiz = validateQuiz({
        title: parsed.title ?? (fileName ? `Quiz from ${fileName}` : 'Generated Quiz'),
        questions: parsed.questions,
      });

      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResults(false);
    } catch (err) {
      console.error('Error generating quiz:', err);
      const msg = err?.message || 'Failed to generate quiz.';
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // ---------- Quiz flow ----------
  const handleQuizAnswer = (index) => {
    if (index === currentQuiz?.questions[currentQuestionIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setShowResults(true);
    }
  };

  // ---------- UI ----------
  return (
    <div className={styles.aiToolsPage}>
      <div className={styles.toolsHero}>
        <h1 className={styles.toolsTitle}>AI Quiz Generator</h1>
        <p className={styles.toolsSubtitle}>Upload a file (text, PDF, DOCX, image) or paste notes to generate a quiz</p>
      </div>

      <div className={styles.toolsContent}>
        {!currentQuiz ? (
          <div className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}>Upload Your Material</h2>
            <p className={styles.sectionDescription}>
              Supported: <strong>.txt, .md, .docx, .pdf, .png, .jpg, .jpeg, .webp, .heic</strong>
            </p>

            <div className={styles.uploadArea}>
              <input
                type="file"
                accept=".txt,.md,.docx,.pdf,.png,.jpg,.jpeg,.webp,.heic,.heif"
                onChange={handleFileUpload}
                className={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.uploadLabel}>
                <div className={styles.uploadIcon}>📁</div>
                <span>Choose a file or drag and drop here</span>
                <span className={styles.uploadHint}>
                  We’ll extract text locally (PDF/DOCX) or let AI analyze the image.
                </span>
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

            {fileName && (
              <div className={styles.fileMeta}>
                <strong>Selected file:</strong> {fileName}
                {imageInline && <em> (image will be analyzed by AI)</em>}
              </div>
            )}

            <button
              className={styles.generateButton}
              onClick={generateQuiz}
              disabled={(!notesInput.trim() && !imageInline) || isGenerating}
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
                  setImageInline(null);
                  setFileName('');
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
