import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

function AISection() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      setResponse('❌ Error fetching response from server.');
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setQuestion('');
    setResponse('');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Cybersecurity AI Response', 10, 15);

    const questionText = `Q: ${question}`;
    const answerText = `A: ${response}`;
    const margin = 10;
    const maxWidth = doc.internal.pageSize.width - margin * 2;

    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(questionText, maxWidth), margin, 30);
    doc.text(doc.splitTextToSize(answerText, maxWidth), margin, 60);

    doc.save('cyber_ai_answer.pdf');
  };

  return (
    <section id="ai-section">
      <h2>🧠 Cyber Threat Intelligence Assistant</h2>
      <p className="section-description">
        Ask cybersecurity or computer science questions. Our AI assistant will give you direct, relevant answers.
      </p>

      <input
        type="text"
        placeholder="e.g. What is a zero-day vulnerability?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="button-group">
        <button onClick={askQuestion}>Ask</button>
        <button onClick={clearFields}>Clear</button>
        <button onClick={downloadPDF} disabled={!response}>Download PDF</button>
      </div>

      <div id="response">
        {loading ? (
          <div className="loader"></div>
        ) : (
          response && <div className>{response}</div>
        )}
      </div>
    </section>
  );
}

export default AISection;
