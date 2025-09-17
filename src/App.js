// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
         <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
       </div>
    </Router>
  );
}

export default App;