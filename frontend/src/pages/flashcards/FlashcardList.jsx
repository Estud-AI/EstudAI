import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FlashcardList.css';

function FlashcardList() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);

  const mockFlashcards = [
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Algebra',
      front: 'What is the quadratic formula?',
      back: 'x = (-b ± √(b² - 4ac)) / 2a',
      color: 'blue'
    },
    {
      id: 2,
      subject: 'History',
      topic: 'French Revolution',
      front: 'When did the French Revolution begin?',
      back: '1789 - The French Revolution began with the Storming of the Bastille on July 14, 1789.',
      color: 'purple'
    },
    {
      id: 3,
      subject: 'Portuguese',
      topic: 'Grammar',
      front: 'What is the function of a subject in a sentence?',
      back: 'The subject is the person, place, or thing that performs the action of the verb.',
      color: 'green'
    },
    {
      id: 4,
      subject: 'Biology',
      topic: 'Cell Structure',
      front: 'What is the function of mitochondria?',
      back: 'Mitochondria are the powerhouse of the cell, generating ATP through cellular respiration.',
      color: 'orange'
    },
    {
      id: 5,
      subject: 'Physics',
      topic: 'Newton\'s Laws',
      front: 'State Newton\'s First Law of Motion',
      back: 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.',
      color: 'red'
    },
    {
      id: 6,
      subject: 'Chemistry',
      topic: 'Periodic Table',
      front: 'What is the atomic number of Carbon?',
      back: '6 - Carbon has 6 protons in its nucleus.',
      color: 'teal'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setFlashcards(mockFlashcards);
      setLoading(false);
    }, 500);
  }, []);

  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flashcard-container">
        <div className="loading">Loading flashcards...</div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <div>
          <h1 className="flashcard-title">Flashcards</h1>
          <p className="flashcard-subtitle">
            Click on any card to reveal the answer
          </p>
        </div>
        <button className="action-button primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New
        </button>
      </div>

      <div className="flashcard-grid">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className={`flashcard ${card.color} ${flipped[card.id] ? 'flipped' : ''}`}
            onClick={() => toggleFlip(card.id)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="card-badge">{card.subject}</div>
                <div className="card-content">
                  <div className="card-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h3 className="card-question">{card.front}</h3>
                </div>
                <div className="card-footer">
                  <span className="card-topic">{card.topic}</span>
                  <span className="card-hint">Click to reveal</span>
                </div>
              </div>
              <div className="flashcard-back">
                <div className="card-badge">{card.subject}</div>
                <div className="card-content">
                  <div className="card-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <p className="card-answer">{card.back}</p>
                </div>
                <div className="card-footer">
                  <span className="card-topic">{card.topic}</span>
                  <span className="card-hint">Click to flip back</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlashcardList;
