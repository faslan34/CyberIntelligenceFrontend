async function askQuestion() {
  const question = document.getElementById("question").value;
  const responseDiv = document.getElementById("response");

  // Clear previous response and show loader
  responseDiv.innerHTML = '<div class="loader"></div>';

  try {
    const result = await fetch("https://cyber-dashboard-h47l.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: question })
    });

    const data = await result.json();
    responseDiv.innerHTML = `<strong>Answer:</strong><br>${data.answer}`;
  } catch (error) {
    responseDiv.innerHTML = "❌ Error getting response. Please try again.";
  }
}

function clearFields() {
  document.getElementById("question").value = "";
  document.getElementById("response").innerHTML = "";
}
async function downloadPDF() {
  const questionText = document.getElementById("question").value.trim();
  const answerText = document.getElementById("response").innerText.trim();

  if (!answerText) {
    alert("No response to download.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  doc.setFontSize(14);
  doc.text("Cybersecurity AI Response", margin, 15);

  doc.setFontSize(12);
  if (questionText) {
    const questionLines = doc.splitTextToSize("Q: " + questionText, maxLineWidth);
    doc.text(questionLines, margin, 30);
  }

  const answerLines = doc.splitTextToSize("A: " + answerText, maxLineWidth);
  doc.text(answerLines, margin, questionText ? 50 : 30); // Start lower if question is included

  doc.save("cyber_ai_answer.pdf");
}
async function loadNews() {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = "<p>Loading latest cybersecurity news...</p>";

  try {
    const res = await fetch("https://cyber-dashboard-h47l.onrender.com/news");
    const articles = await res.json();

    newsContainer.innerHTML = ""; // Clear placeholder

    articles.forEach(article => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
		<p><em>Source: ${article.link.split('/')[2]}</em></p>
        <a href="${article.link}" target="_blank">Read more →</a>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    newsContainer.innerHTML = "<p>⚠️ Failed to load news. Please try again later.</p>";
  }
}
async function loadCisaVulnerabilities() {
  const container = document.getElementById("cisa-container");
  container.innerHTML = "<p>Loading known exploited vulnerabilities...</p>";

  try {
    const res = await fetch("https://cyber-dashboard-h47l.onrender.com/api/cisa-alerts");
    const vulns = await res.json();

    container.innerHTML = "";
    vulns.forEach(vuln => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <h3>${vuln.cveID} – ${vuln.vulnName}</h3>
        <p><strong>Vendor:</strong> ${vuln.vendor}<br>
        <strong>Product:</strong> ${vuln.product}<br>
        <strong>Date Added:</strong> ${vuln.dateAdded}</p>
		<p><em>Source: CISA KEV</em></p>
        <a href="${vuln.link}" target="_blank">View on NVD →</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>⚠️ Failed to load vulnerabilities.</p>";
  }
}
async function loadNvdVulnerabilities() {
  const container = document.getElementById("nvd-container");
  container.innerHTML = "<p>Loading recent NVD vulnerabilities...</p>";

  try {
    const res = await fetch("https://cyber-dashboard-h47l.onrender.com/api/threat-intel");
    const vulns = await res.json();

    container.innerHTML = "";
    vulns.forEach(vuln => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <h3>${vuln.id} – Severity: ${vuln.severity}</h3>
        <p>${vuln.description}</p>
        <p><strong>CVSS Score:</strong> ${vuln.score}</p>
        <a href="${vuln.link}" target="_blank">View on NVD →</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>⚠️ Failed to load NVD data.</p>";
  }
}
async function loadThreatIntel() {
  const container = document.getElementById("threat-container");
  container.innerHTML = "<p>Loading threat intelligence feeds...</p>";

  try {
    const res = await fetch("https://cyber-dashboard-h47l.onrender.com/osint-lookup");
    const threats = await res.json();

    container.innerHTML = "";
    threats.forEach(threat => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <h3>${threat.title}</h3>
        <p>${threat.summary}</p>
        <p><strong>Published:</strong> ${threat.published}</p>
		<p><em>Source: ${threat.link.split('/')[2]}</em></p>
        <a href="${threat.link}" target="_blank">Read more →</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>⚠️ Failed to load threat intel.</p>";
  }
}
async function searchOSINT() {
  const input = document.getElementById("osint-input").value.trim();
  const resultsDiv = document.getElementById("osint-results");
  resultsDiv.innerHTML = "Loading...";

  try {
    const res = await fetch("https://cyber-dashboard-h47l.onrender.com/osint-lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: input })
    });

    const data = await res.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>⚠️ ${data.error}</p>`;
      return;
    }

    resultsDiv.innerHTML = "";

    data.results.forEach(result => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <h3>${result.source}</h3>
        <p>${result.info}</p>
        <p><em>Source: ${result.source}</em></p>
        <a href="${result.link}" target="_blank">View Report →</a>
      `;
      resultsDiv.appendChild(card);
    });

  } catch (err) {
    resultsDiv.innerHTML = "<p>❌ Failed to retrieve OSINT data.</p>";
  }
}

function clearOSINT() {
  document.getElementById("osint-input").value = "";
  document.getElementById("osint-results").innerHTML = "";
}

window.onload = () => {
  loadNews();
  loadCisaVulnerabilities();
  loadThreatIntel(); 
};

function showSection(id) {
  const sections = ['home', 'ai-section', 'news-section', 'cisa-section', 'threat-section', 'osint-section'];
  
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'none';
  });

  const target = document.getElementById(id);
  if (target) target.style.display = 'block';

  window.scrollTo(0, 0); // scroll to top
}
function showAllSections() {
  const sections = ['home', 'ai-section', 'news-section', 'cisa-section', 'threat-section', 'osint-section'];

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.style.display = 'block';
  });

  window.scrollTo(0, 0);
}