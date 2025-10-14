import React, { useState } from 'react';
import styles from './AICareerExplorer.module.css';


export default function AICareerExplorer() {
const [interests, setInterests] = useState('');


const exploreCareer = (e) => {
e.preventDefault();
if (!interests.trim()) return;
// demo only; wire to your API as needed
alert('Exploring career paths…');
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


<button className={styles.cta} disabled={!interests.trim()}>
<span className={styles.icon} aria-hidden>🔎</span>
<span>Explore Career Paths</span>
</button>
</form>
</section>
</div>
</div>
);
}