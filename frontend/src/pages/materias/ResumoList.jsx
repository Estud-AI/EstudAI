import React from 'react';
import { Link } from 'react-router-dom';

function ResumoList() {
	// Conteúdo fictício para teste
		return (
			<div style={{ padding: '2rem' }}>
				<h2>Resumos</h2>
				<ul>
					<li>Resumo de Álgebra</li>
					<li>Resumo de Literatura</li>
					<li>Resumo de História do Brasil</li>
				</ul>
				<Link to="/home" style={{marginTop: '2rem', display: 'inline-block', color: 'var(--primary-blue)', fontWeight: 600}}>Voltar para Início</Link>
			</div>
		);
}

export default ResumoList;
