import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Statistics from './pages/Statistics'; // adjust path if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/statistics" element={<Statistics />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
