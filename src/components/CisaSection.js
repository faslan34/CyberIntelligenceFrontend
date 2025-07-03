import React, { useEffect, useState } from 'react';

function CisaSection() {
  const [vulns, setVulns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('newest');
  const perPage = 10;

  useEffect(() => {
    fetch("/https://cyber-dashboard-h47l.onrender.com/api/cisa-alerts")
      .then((res) => res.json())
      .then((data) => {
        const results = data.vulnerabilities || data || [];
        setVulns(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading CISA vulnerabilities:", error);
        setLoading(false);
      });
  }, []);

  const getSeverity = (vuln) => {
    const name = vuln.vulnerabilityName?.toLowerCase() || "";
    const note = vuln.notes?.toLowerCase() || "";
    if (note.includes("ransomware") || name.includes("rce") || name.includes("remote code")) return "Critical";
    if (name.includes("privilege escalation")) return "High";
    if (name.includes("bypass") || name.includes("denial of service")) return "Medium";
    if (name.includes("info") || name.includes("disclosure")) return "Low";
    return "Unknown";
  };

  const severityColor = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#10b981",
    Unknown: "#9ca3af"
  };

  const filtered = vulns
    .map(v => ({ ...v, severity: getSeverity(v) }))
    .filter((vuln) => {
      const searchMatch = [vuln.cveID, vuln.product, vuln.vulnerabilityName]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const vulnDate = new Date(vuln.dateAdded);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const dateMatch = (!start || vulnDate >= start) && (!end || vulnDate <= end);

      return searchMatch && dateMatch;
    });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.dateAdded);
    const dateB = new Date(b.dateAdded);
    const severityRank = { Critical: 4, High: 3, Medium: 2, Low: 1, Unknown: 0 };

    switch (sortOption) {
      case "oldest": return dateA - dateB;
      case "newest": return dateB - dateA;
      case "severity-high": return severityRank[b.severity] - severityRank[a.severity];
      case "severity-low": return severityRank[a.severity] - severityRank[b.severity];
      default: return 0;
    }
  });

  const startIndex = (currentPage - 1) * perPage;
  const paginated = sorted.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  return (
    <section id="cisa-section">
      <h2>🚨 Known Exploited Vulnerabilities (CISA KEV)</h2>

      {/* Search input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4 }}>Search</label>
        <input
          type="text"
          placeholder="Search CVE, product, or name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: '6px 12px', width: '100%' }}
        />
      </div>

      {/* Date range + Sort filters (in a responsive flex row) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '3rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: '6px 10px', width: '100%' }}
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: '6px 10px', width: '100%' }}
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: 5 }}>Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: '6px 12px', width: '100%' }}
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
            <option value="severity-high">Highest Severity → Lowest</option>
            <option value="severity-low">Lowest Severity → Highest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading vulnerabilities...</div>
      ) : (
        <>
          <div id="cisa-container" className="news-grid">
            {paginated.map((vuln, index) => (
              <div className="news-card" key={index}>
                <h3>{vuln.cveID} – {vuln.vulnerabilityName}</h3>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: severityColor[vuln.severity],
                    color: "#fff",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    marginBottom: "6px"
                  }}
                >
                  {vuln.severity}
                </span>
                <p><strong>Vendor:</strong> {vuln.vendorProject}</p>
                <p><strong>Product:</strong> {vuln.product}</p>
                <p><strong>Date Added:</strong> {vuln.dateAdded}</p>
                <a
                  href={`https://nvd.nist.gov/vuln/detail/${vuln.cveID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on NVD →
                </a>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              ◀ Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next ▶
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default CisaSection;
