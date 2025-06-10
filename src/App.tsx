import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Games from './pages/Games';
import Pricing from './pages/Pricing';
import KeySystem from './pages/KeySystem';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/key-system" element={<KeySystem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;