import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import styles from './AICareerExplorer.module.css';

export default function AICareerExplorer() {
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [careerResults, setCareerResults] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Key is defined in this file (as requested)
  const API_KEY = 'AIzaSyAmpiNC6GB9vwIAP0oz8JS0On8iKETxX8Q';

  const safeParseJson = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      const m = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (m) return JSON.parse(m[1]);
      throw new Error('The AI response was not valid JSON.');
    }
  };

  const exploreCareer = async (e) => {
    e.preventDefault();
    if (!interests.trim()) return;

    setIsLoading(true);
    setError(null);
    setCareerResults(null);

    try {
      if (!API_KEY) throw new Error('API key missing.');

      // New SDK client, pinned to v1 (avoids v1beta 404s)
      const ai = new GoogleGenAI({ apiKey: API_KEY, apiVersion: 'v1' });

      const prompt = `Based on the following interests and skills: "${interests}", suggest 3-5 potential career paths. For each career, provide:
1) title
2) description (2-3 sentences)
3) skills (comma-separated)
4) matchReason
5) salaryRange (if applicable)
Return ONLY JSON (no prose) as an array of objects with keys: title, description, skills, matchReason, salaryRange.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        // NOTE: snake_case for the new SDK:
        config: { response_mime_type: 'application/json' },
      });

      const parsed = safeParseJson(res.text);

      const normalized = Array.isArray(parsed)
        ? parsed.map((c) => ({
            title: c.title ?? 'Untitled',
            description: c.description ?? '',
            skills: c.skills ?? '',
            matchReason: c.matchReason ?? '',
            salaryRange: c.salaryRange ?? 'N/A',
          }))
        : [];

      if (!normalized.length) throw new Error('No results returned. Try adding a bit more detail to your interests.');

      setCareerResults(normalized);
    } catch (err) {
      console.error('Error generating career suggestions:', err);
      setError(err?.message || 'Failed to generate career suggestions. Please try again.');
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
              {careerResults.map((c, i) => (
                <div key={i} className={styles.careerCard}>
                  <h4>{c.title}</h4>
                  <p>{c.description}</p>
                  <p><strong>Key Skills:</strong> {c.skills}</p>
                  <p><strong>Why it matches:</strong> {c.matchReason}</p>
                  <p><strong>Salary Range:</strong> {c.salaryRange}</p>
                </div>
              ))}
              <button
                className={styles.resetButton}
                onClick={() => { setCareerResults(null); setInterests(''); }}
              >
                Explore Again
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
