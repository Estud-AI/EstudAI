import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './SubjectDetail.css';

function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockSubjects = {
    1: {
      id: 1,
      name: 'Mathematics',
      description: 'Master fundamental and advanced mathematical concepts including algebra, geometry, calculus, and statistics.',
      color: 'blue',
      progress: 75,
      topics: [
        { id: 1, name: 'Algebra', completed: true },
        { id: 2, name: 'Geometry', completed: true },
        { id: 3, name: 'Calculus', completed: false },
        { id: 4, name: 'Statistics', completed: false },
      ],
      flashcards: 45,
      summaries: 8,
      quizzes: 6
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSubject(mockSubjects[id] || mockSubjects[1]);
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="subject-detail-container">
        <div className="loading">Loading subject...</div>
      </div>
    );
  }

  return (
    <div className="subject-detail-container">
      <Link to="/subjects" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Subjects
      </Link>

      <div className={`subject-detail-header ${subject.color}`}>
        <div className="header-content">
          <h1 className="subject-detail-title">{subject.name}</h1>
          <p className="subject-detail-description">{subject.description}</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-value">{subject.progress}%</span>
            <span className="stat-label">Complete</span>
          </div>
        </div>
      </div>

      <div className="subject-content">
        <div className="content-section">
          <h2 className="section-title">Topics</h2>
          <div className="topics-list">
            {subject.topics.map((topic) => (
              <div key={topic.id} className="topic-item">
                <div className="topic-info">
                  <div className={`topic-status ${topic.completed ? 'completed' : ''}`}>
                    {topic.completed ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <div className="topic-dot"></div>
                    )}
                  </div>
                  <span className="topic-name">{topic.name}</span>
                </div>
                <button className="topic-action">Study</button>
              </div>
            ))}
          </div>
        </div>

        <div className="content-grid">
          <Link to={`/subjects/${subject.id}/flashcards`} className="content-card">
            <div className="card-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 3h2a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Flashcards</h3>
              <p className="card-description">{subject.flashcards} cards available</p>
            </div>
            <svg className="card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link to={`/subjects/${subject.id}/summaries`} className="content-card">
            <div className="card-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Summaries</h3>
              <p className="card-description">{subject.summaries} summaries available</p>
            </div>
            <svg className="card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link to={`/subjects/${subject.id}/quizzes`} className="content-card">
            <div className="card-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Quizzes</h3>
              <p className="card-description">{subject.quizzes} quizzes available</p>
            </div>
            <svg className="card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
