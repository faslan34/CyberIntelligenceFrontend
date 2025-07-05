
import React, { useEffect, useState } from 'react';

const ThreatIntelFeed = () => {
  const [intel, setIntel] = useState([]);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch('http://https://cyber-dashboard-h47l.onrender.com/api/threat-intel');
        const data = await res.json();
        setIntel(data);
      } catch (error) {
        console.error('Error fetching threat intel:', error);
      }
    };

    fetchIntel();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Threat Intelligence Feed
      </h2>

      {intel.length === 0 ? (
        <p>No threat intelligence data available.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}
        >
          {intel.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '0.5rem'
                }}
              >
                {item.source}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {item.description}
              </p>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#1d4ed8', textDecoration: 'underline' }}
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreatIntelFeed;
