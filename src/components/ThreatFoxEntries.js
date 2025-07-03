
import React, { useEffect, useState } from 'react';

const getColorByThreatType = (type) => {
  const colorMap = {
    malware: '#fdecea',
    phishing: '#fff8e1',
    botnet: '#e3f2fd',
    botnet_cc: '#e3f2fd',
    ransomware: '#f3e5f5',
  };
  return colorMap[type] || '#f5f5f5';
};

const getLabelColor = (type) => {
  const colorMap = {
    malware: '#c62828',
    phishing: '#f9a825',
    botnet: '#1565c0',
    botnet_cc: '#1565c0',
    ransomware: '#6a1b9a',
  };
  return colorMap[type] || '#616161';
};

const ThreatFoxEntries = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [threatTypes, setThreatTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/threatfox');
        const json = await res.json();
        const malware = json.malware || [];
        setData(malware);
        const uniqueTypes = [...new Set(malware.map(item => item.threat_type))];
        setThreatTypes(uniqueTypes);
      } catch (err) {
        console.error('Error fetching ThreatFox data:', err);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesFilter = filter ? item.threat_type === filter : true;
    const matchesSearch =
      item.ioc?.toLowerCase().includes(search.toLowerCase()) ||
      item.malware?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleEntries = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const sidePages = 2;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const left = Math.max(2, currentPage - sidePages);
      const right = Math.min(totalPages - 1, currentPage + sidePages);

      if (left > 2) pages.push('...');
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        ThreatFox Entries
      </h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search IOC or malware..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '250px'
          }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">All Threat Types</option>
          {threatTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {visibleEntries.length === 0 ? (
        <p>No entries match your criteria.</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}
          >
            {visibleEntries.map((entry, index) => {
              const bgColor = getColorByThreatType(entry.threat_type);
              const labelColor = getLabelColor(entry.threat_type);
              return (
                <div
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: bgColor
                  }}
                >
                  <div
                    style={{
                      backgroundColor: labelColor,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '10px'
                    }}
                  >
                    {entry.threat_type?.toUpperCase() || 'UNKNOWN'}
                  </div>
                  <p style={{ wordBreak: "break-all", overflowWrap: "break-word" }}><strong>IOC:</strong> {entry.ioc}</p>
                  <p><strong>Malware:</strong> {entry.malware}</p>
                  <p><strong>Confidence:</strong> {entry.confidence_level}</p>
                  {entry.reference && (
                    <p>
                      <strong>Reference:</strong>{' '}
                      <a href={entry.reference} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ marginRight: '0.5rem' }}
            >
              ◀ Prev
            </button>
            {getPageNumbers().map((num, idx) =>
              num === '...' ? (
                <span key={idx} style={{ margin: '0 0.25rem' }}>...</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(num)}
                  style={{
                    margin: '0 0.25rem',
                    fontWeight: currentPage === num ? 'bold' : 'normal'
                  }}
                >
                  {num}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ marginLeft: '0.5rem' }}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreatFoxEntries;
