import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SummaryList.css';

function SummaryList() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const mockSummaries = [
    {
      id: 1,
      title: 'Algebraic Equations',
      subject: 'Mathematics',
      content: 'Comprehensive overview of linear and quadratic equations, including solving methods and practical applications.',
      wordCount: 850,
      readTime: 4,
      color: 'blue',
      date: '2024-11-01'
    },
    {
      id: 2,
      title: 'The French Revolution',
      subject: 'History',
      content: 'Analysis of the causes, key events, and consequences of the French Revolution from 1789 to 1799.',
      wordCount: 1200,
      readTime: 6,
      color: 'purple',
      date: '2024-10-28'
    },
    {
      id: 3,
      title: 'Portuguese Grammar Basics',
      subject: 'Portuguese',
      content: 'Essential grammar rules including verb conjugation, sentence structure, and common exceptions.',
      wordCount: 650,
      readTime: 3,
      color: 'green',
      date: '2024-10-25'
    },
    {
      id: 4,
      title: 'Cell Biology Fundamentals',
      subject: 'Biology',
      content: 'Detailed exploration of cell structure, organelles, and their functions in living organisms.',
      wordCount: 950,
      readTime: 5,
      color: 'orange',
      date: '2024-10-22'
    },
    {
      id: 5,
      title: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      content: 'Understanding the three fundamental laws that describe the relationship between force and motion.',
      wordCount: 780,
      readTime: 4,
      color: 'red',
      date: '2024-10-20'
    },
    {
      id: 6,
      title: 'Periodic Table Guide',
      subject: 'Chemistry',
      content: 'Complete guide to understanding the periodic table, element groups, and chemical properties.',
      wordCount: 1100,
      readTime: 5,
      color: 'teal',
      date: '2024-10-18'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setSummaries(mockSummaries);
      setLoading(false);
    }, 500);
  }, []);

  const subjects = ['all', ...new Set(mockSummaries.map(s => s.subject))];
  const filteredSummaries = filter === 'all' 
    ? summaries 
    : summaries.filter(s => s.subject === filter);

  if (loading) {
    return (
      <div className="summary-container">
        <div className="loading">Loading summaries...</div>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-header">
        <div>
          <h1 className="summary-title">Study Summaries</h1>
          <p className="summary-subtitle">
            AI-generated summaries to help you learn faster
          </p>
        </div>
        <button className="action-button primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Generate New
        </button>
      </div>

      <div className="filter-bar">
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`filter-button ${filter === subject ? 'active' : ''}`}
            onClick={() => setFilter(subject)}
          >
            {subject === 'all' ? 'All Subjects' : subject}
          </button>
        ))}
      </div>

      <div className="summary-list">
        {filteredSummaries.map((summary) => (
          <Link 
            key={summary.id} 
            to={`/summaries/${summary.id}`}
            className={`summary-card ${summary.color}`}
          >
            <div className="summary-card-header">
              <div className="summary-meta">
                <span className="summary-badge">{summary.subject}</span>
                <span className="summary-date">{new Date(summary.date).toLocaleDateString()}</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="summary-card-title">{summary.title}</h3>
            <p className="summary-card-content">{summary.content}</p>
            <div className="summary-card-footer">
              <div className="summary-stats">
                <span className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {summary.readTime} min read
                </span>
                <span className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {summary.wordCount} words
                </span>
              </div>
              <span className="read-more">Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SummaryList;
