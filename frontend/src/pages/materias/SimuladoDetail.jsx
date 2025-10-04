import React from 'react';
import { Link } from 'react-router-dom';

function SimuladoDetail() {
	// Conteúdo fictício para teste
		return (
			<div style={{ padding: '2rem' }}>
				<h2>Detalhes do Simulado</h2>
				<p>Simulado ENEM - 50 questões</p>
				<ul>
					<li>Matemática: 20 questões</li>
					<li>Ciências Humanas: 15 questões</li>
					<li>Linguagens: 15 questões</li>
				</ul>
				<Link to="/home" style={{marginTop: '2rem', display: 'inline-block', color: 'var(--primary-blue)', fontWeight: 600}}>Voltar para Início</Link>
			</div>
		);
}

export default SimuladoDetail;
