import React from 'react';
import { Link } from 'react-router-dom';

function MateriaDetail() {
	// Conteúdo fictício para teste
		return (
			<div style={{ padding: '2rem' }}>
				<h2>Matéria: Matemática</h2>
				<p>Conteúdo fictício sobre a matéria de Matemática.</p>
				<ul>
					<li>Resumo: Álgebra, Geometria, Estatística</li>
					<li>Flashcards: 20 disponíveis</li>
					<li>Simulados: 3 disponíveis</li>
				</ul>
				<Link to="/home" style={{marginTop: '2rem', display: 'inline-block', color: 'var(--primary-blue)', fontWeight: 600}}>Voltar para Início</Link>
			</div>
		);
}

export default MateriaDetail;
