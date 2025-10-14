import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styles from './AICareerExplorer.module.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

export default function AICareerExplorer() {
const [interests, setInterests] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [careerResults, setCareerResults] = useState(null);
const [error, setError] = useState(null);

const exploreCareer = async (e) => {
e.preventDefault();
if (!interests.trim()) return;

setIsLoading(true);
setError(null);
setCareerResults(null);

try {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Based on the following interests and skills: "${interests}", suggest 3-5 potential career paths. For each career, provide:
  1. Career title
  2. Brief description (2-3 sentences)
  3. Key skills required
  4. Why it matches their interests
  5. Potential salary range (if applicable)
  
  Format the response as a JSON array of objects with keys: title, description, skills, matchReason, salaryRange.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse the JSON response
  const parsedResults = JSON.parse(text);
  setCareerResults(parsedResults);
} catch (err) {
  console.error('Error generating career suggestions:', err);
  setError('Failed to generate career suggestions. Please try again.');
} finally {
  setIsLoading(false);
}
};


return (
<div className={styles.pageBg}>
<div className={styles.wrap}>
<header className={styles.hero}>
<h1 className={styles.title}>AI Career Explorer</h1>
<p className={styles.subtitle}>
Discover your ideal career path with AI-powered recommendations
</p>
</header>


<section className={styles.panel}>
<h2 className={styles.panelTitle}>Tell us about your interests</h2>

{!careerResults && (
<form onSubmit={exploreCareer}>
<div className={styles.taWrap}>
<textarea
className={styles.ta}
placeholder="Describe your interests, skills, and what you enjoy doing..."
rows={7}
value={interests}
onChange={(e) => setInterests(e.target.value)}
/>
</div>

<button className={styles.cta} disabled={!interests.trim() || isLoading}>
<span className={styles.icon} aria-hidden>🔎</span>
<span>{isLoading ? 'Exploring...' : 'Explore Career Paths'}</span>
</button>
</form>
)}

{isLoading && (
<div className={styles.loading}>
<p>Generating career recommendations...</p>
</div>
)}

{error && (
<div className={styles.error}>
<p>{error}</p>
<button onClick={() => setError(null)}>Try Again</button>
</div>
)}

{careerResults && (
<div className={styles.results}>
<h3>Your Career Recommendations</h3>
{careerResults.map((career, index) => (
<div key={index} className={styles.careerCard}>
<h4>{career.title}</h4>
<p>{career.description}</p>
<p><strong>Key Skills:</strong> {career.skills}</p>
<p><strong>Why it matches:</strong> {career.matchReason}</p>
<p><strong>Salary Range:</strong> {career.salaryRange}</p>
</div>
))}
<button className={styles.resetButton} onClick={() => { setCareerResults(null); setInterests(''); }}>
Explore Again
</button>
</div>
)}
</section>
</div>
</div>
);
}