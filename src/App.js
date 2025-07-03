// src/App.js
import './style.css';
import React from 'react';
import './App.css'; // optional: use if you want to keep the styles
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <h1>Aslan Cyber Intelligence Dashboard (ACID)</h1>
      <Dashboard />

      <footer className="footer-disclaimer">
        <strong>Disclaimer:</strong> This dashboard aggregates public threat intelligence and cybersecurity data from open and third-party
		sources such as CISA, ThreatFox, AbuseIPDB, URLScan, and others. All data belongs to their respective
		owners and is used for educational and research purposes only.
      </footer>
    </div>
  );
}

export default App;
