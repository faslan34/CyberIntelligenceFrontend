import React, { useEffect, useState } from 'react';

function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://cyber-dashboard-h47l.onrender.com/news");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section id="news-section">
      <h2>📰 Cybersecurity News</h2>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="news-grid">
          {news.map((article, index) => (
            <div className="news-card" key={index}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <p><em>Source: {article.link.split('/')[2]}</em></p>
              <a href={article.link} target="_blank" rel="noopener noreferrer">Read more →</a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NewsSection;
