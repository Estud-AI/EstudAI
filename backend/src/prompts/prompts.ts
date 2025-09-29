const { readFileSync } = require('fs');
const { join } = require('path');

// Interface para definir os tipos de prompts disponíveis
export interface Prompts {
  resumo: string;
  simulado: string;
  flashcards: string;
  materia: string;
}

// Tipos válidos de prompt
export type PromptType = keyof Prompts;

// Carregar os prompts do arquivo JSON
const prompts: Prompts = JSON.parse(
  readFileSync(join(__dirname, 'prompts.json'), 'utf8')
);

/**
 * Função para obter um prompt formatado com o tema
 * @param type - Tipo do prompt (resumo, simulado, flashcards, materia)
 * @param tema - Tema da matéria
 * @returns Prompt formatado
 */
export function getPrompt(type: PromptType, tema: string): string {
  if (!prompts[type]) {
    throw new Error(`Tipo de prompt '${type}' não encontrado`);
  }
  
  return prompts[type].replace('{tema}', tema);
}

/**
 * Função para listar todos os tipos de prompts disponíveis
 * @returns Lista com os tipos de prompts disponíveis
 */
export function listPrompts(): PromptType[] {
  return Object.keys(prompts) as PromptType[];
}

/**
 * Função para verificar se um tipo de prompt é válido
 * @param type - Tipo a ser verificado
 * @returns true se o tipo for válido
 */
export function isValidPromptType(type: string): type is PromptType {
  return type in prompts;
}

// Exportar os prompts carregados para uso direto se necessário
export { prompts };

// Exemplos de uso comentados:

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
// const promptCompleto = getPrompt('materia', 'Equações do Segundo Grau');
// console.log('Prompt Completo:', promptCompleto);