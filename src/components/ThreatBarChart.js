import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const ThreatBarChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchThreatData = async () => {
      try {
        const res = await fetch("https://cyber-dashboard-h47l.onrender.com/api/threatfox");
        const json = await res.json();
        console.log("📊 ThreatFox chart data:", json);

        const items = Array.isArray(json.malware) ? json.malware : [];

        const grouped = {};
        items.forEach(item => {
          if (item.threat_type) {
            grouped[item.threat_type] = (grouped[item.threat_type] || 0) + 1;
          }
        });

        const formattedData = Object.entries(grouped).map(([type, count]) => ({
          name: type,
          count,
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error('❌ Error fetching chart data:', err);
      }
    };

    fetchThreatData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ThreatFox Threat Type Frequency</h2>
      {chartData.length === 0 ? (
        <p>No data available for chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ThreatBarChart;
