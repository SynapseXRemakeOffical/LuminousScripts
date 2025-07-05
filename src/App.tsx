import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Games from './pages/Games';
import Pricing from './pages/Pricing';
import KeySystem from './pages/KeySystem';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/key-system" element={<KeySystem />} />
          <Route path="/xk9m2p7q8w3n5r1t" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;