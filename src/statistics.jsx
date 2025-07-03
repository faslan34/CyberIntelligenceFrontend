import React, { useEffect, useState } from "react";
import axios from "axios";

const Statistics = () => {
  const [cisaAlerts, setCisaAlerts] = useState([]);
  const [threatFoxStats, setThreatFoxStats] = useState([]);

  useEffect(() => {
    // Fetch CISA alerts
    axios.get("http://localhost:5000/api/cisa-alerts")
      .then(res => setCisaAlerts(res.data.alerts || []))
      .catch(err => console.error("CISA error:", err));

    // Fetch ThreatFox stats
    axios.get("http://localhost:5000/api/threatfox")
      .then(res => setThreatFoxStats(res.data.top_malware_tags || []))
      .catch(err => console.error("ThreatFox error:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Cyber Threat Statistics</h1>

      {/* CISA Alerts Section */}
      <section style={{ marginTop: "2rem" }}>
        <h2>CISA Latest Alerts</h2>
        {cisaAlerts.length === 0 ? (
          <p>Loading CISA alerts...</p>
        ) : (
          <ul>
            {cisaAlerts.map((alert, index) => (
              <li key={index} style={{ marginBottom: "1rem" }}>
                <a href={alert.link} target="_blank" rel="noreferrer">
                  <strong>{alert.title}</strong>
                </a>
                <p><em>{alert.published}</em></p>
                <p>{alert.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ThreatFox Section */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Top Malware (ThreatFox)</h2>
        {threatFoxStats.length === 0 ? (
          <p>Loading ThreatFox stats...</p>
        ) : (
          <ul>
            {threatFoxStats.map((item, index) => (
              <li key={index}>
                <strong>{item.malware}</strong>: {item.count} detections
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Statistics;
