import React, { useState } from 'react';

function OsintSection() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("https://cyber-dashboard-h47l.onrender.com/osint-lookup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input.trim() }),
      });
      const data = await res.json();

      if (data.error) {
        setResults([{ source: 'Error', info: data.error, link: '' }]);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setResults([{ source: 'Error', info: 'Could not reach server.', link: '' }]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setInput('');
    setResults([]);
  };

  return (
    <section id="osint-section">
      <h2>🔎 OSINT Reputation Checker</h2>
      <input
        type="text"
        id="osint-input"
        placeholder="Enter IP, domain, or hash..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="button-group">
        <button onClick={search}>Search</button>
        <button onClick={clear}>Clear</button>
      </div>

      <div id="osint-results" className="news-grid">
        {loading ? (
          <div className="loader"></div>
        ) : (
          results.map((res, idx) => (
            <div className="news-card" key={idx}>
              <h3>{res.source}</h3>
              <p>{res.info}</p>
              {res.link && (
                <a href={res.link} target="_blank" rel="noopener noreferrer">
                  View Report →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default OsintSection;
