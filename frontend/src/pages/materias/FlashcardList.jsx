import React from 'react';
import { Link } from 'react-router-dom';

function FlashcardList() {
	// Conteúdo fictício para teste
		return (
			<div style={{ padding: '2rem' }}>
				<h2>Flashcards</h2>
				<ul>
					<li>Equação do 2º grau</li>
					<li>Revolução Francesa</li>
					<li>Função do sujeito</li>
				</ul>
				<Link to="/home" style={{marginTop: '2rem', display: 'inline-block', color: 'var(--primary-blue)', fontWeight: 600}}>Voltar para Início</Link>
			</div>
		);
}

export default FlashcardList;
