import React from 'react';
import { Link } from 'react-router-dom';

function SimuladoList() {
	// Conteúdo fictício para teste
		return (
			<div style={{ padding: '2rem' }}>
				<h2>Simulados / Quizzes</h2>
				<ul>
					<li>Simulado ENEM</li>
					<li>Simulado Matemática</li>
					<li>Simulado História</li>
				</ul>
				<Link to="/home" style={{marginTop: '2rem', display: 'inline-block', color: 'var(--primary-blue)', fontWeight: 600}}>Voltar para Início</Link>
			</div>
		);
}

export default SimuladoList;
