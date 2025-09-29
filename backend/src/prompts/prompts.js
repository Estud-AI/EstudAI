const fs = require('fs');
const path = require('path');

// Carregar os prompts
const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, 'prompts.json'), 'utf8'));

export function getPrompt(type, tema) {
  if (!prompts.prompts[type]) {
    throw new Error(`Tipo de prompt '${type}' não encontrado`);
  }
  
  return prompts.prompts[type].template.replace('{tema}', tema);
}

// Exemplos de uso:

// 1. Gerar prompt para resumo
// const temaExemplo = 'Revolução Francesa';
// const promptResumo = getPrompt('resumo', temaExemplo);
// console.log('Prompt Resumo:', promptResumo);

// 2. Gerar prompt para simulado
// const promptSimulado = getPrompt('simulado', 'Fotossíntese');
// console.log('Prompt Simulado:', promptSimulado);

// 3. Gerar prompt para flashcards
// const promptFlashcards = getPrompt('flashcards', 'Sistema Solar');
// console.log('Prompt Flashcards:', promptFlashcards);

// 4. Gerar prompt para material completo
// const promptCompleto = getPrompt('materia_completa', 'Equações do Segundo Grau');
// console.log('Prompt Completo:', promptCompleto);