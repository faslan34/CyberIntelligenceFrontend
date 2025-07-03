import './style.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<div>Welcome to the Dashboard</div>} />
      </Routes>
    </Router>
  );
}

export default App;

