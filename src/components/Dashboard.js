import React, { useState } from 'react';
import AISection from './AISection';
import NewsSection from './NewsSection';
import CisaSection from './CisaSection';
import ThreatSection from './ThreatSection';
import OsintSection from './OsintSection';
import ThreatFoxEntries from './ThreatFoxEntries';
import ThreatBarChart from './ThreatBarChart';
import '../style.css';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <>
      <div className="tab-bar">
        <button onClick={() => setActiveSection('home')} className={activeSection === 'home' ? 'active' : ''}>🏠 Home</button>
        <button onClick={() => setActiveSection('ai')} className={activeSection === 'ai' ? 'active' : ''}>💬 AI Assistant</button>
        <button onClick={() => setActiveSection('news')} className={activeSection === 'news' ? 'active' : ''}>📰 Cyber News</button>
        <button onClick={() => setActiveSection('cisa')} className={activeSection === 'cisa' ? 'active' : ''}>🚨 Vulnerabilities</button>
        <button onClick={() => setActiveSection('threat')} className={activeSection === 'threat' ? 'active' : ''}>📡 Threat Intel</button>
        <button onClick={() => setActiveSection('osint')} className={activeSection === 'osint' ? 'active' : ''}>🔎 OSINT Lookup</button>
        <button onClick={() => setActiveSection('stats')} className={activeSection === 'stats' ? 'active' : ''}>📊 Statistics</button>
        <button onClick={() => setActiveSection('all')} className={activeSection === 'all' ? 'active' : ''}>📄 Show All</button>
      </div>

      <div className="dashboard">
        <div className="main-content">
          {activeSection === 'home' && (
            <div className="home-hero">
              <div className="hero-content">
                <h1>Welcome to ACID</h1>
                <h2>Aslan Cyber Intelligence Dashboard</h2>
                <p>One dashboard to view real-time cyber threat intelligence, known vulnerabilities, OSINT insights, and more.</p>
                <p>Select a section from the tab menu to get started 🔍</p>
              </div>
            </div>
          )}
          {activeSection === 'ai' && <AISection />}
          {activeSection === 'news' && <NewsSection />}
          {activeSection === 'cisa' && <CisaSection />}
          {activeSection === 'threat' && <ThreatSection />}
          {activeSection === 'osint' && <OsintSection />}
          {activeSection === 'stats' && (
            <>
              <ThreatBarChart />
              <ThreatFoxEntries />
            </>
          )}
          {activeSection === 'all' && (
            <>
              <AISection />
              <NewsSection />
              <CisaSection />
              <ThreatSection />
              <OsintSection />
              <ThreatBarChart />
              <ThreatFoxEntries />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
