import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/home.css';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <div className="home-card">
            <h2>Bem-vindo ao EstudAI!</h2>
            <p>Explore matérias, quizzes e muito mais para turbinar seus estudos.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
