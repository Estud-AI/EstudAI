const { readFileSync } = require('fs');
const { join } = require('path');

// Interface para definir os tipos de prompts disponíveis
export interface Prompts {
  summary: string;
  test: string;
  flashcards: string;
  subject: string;
}

// Tipos válidos de prompt
export type PromptType = keyof Prompts;

// Carregar os prompts do arquivo JSON
const prompts: Prompts = JSON.parse(
  readFileSync(join(__dirname, 'prompts.json'), 'utf8')
);

/**
 * Função para obter um prompt formatado com o tema
 * @param type - Tipo do prompt (summary, test, flashcards, subject)
 * @param tema - Tema da matéria
 * @returns Prompt formatado
 */
export function getPrompt(type: PromptType, tema: string, placeholders?: Record<string, string>): string {
  if (!prompts[type]) {
    throw new Error(`Tipo de prompt '${type}' não encontrado`);
  }

  let result = prompts[type].replace('{tema}', tema);

  if (placeholders) {
    for (const key of Object.keys(placeholders)) {
      const token = `{${key}}`;
      result = result.replace(new RegExp(token, 'g'), placeholders[key]);
    }
  }

  return result;
}

export { prompts };

// Exemplos de uso comentados:

// 1. Gerar prompt para resumo
// const temaExemplo = 'Revolução Francesa';
// const promptResumo = getPrompt('summary', temaExemplo);
// console.log('Prompt Resumo:', promptResumo);

// 2. Gerar prompt para simulado
// const promptSimulado = getPrompt('test', 'Fotossíntese');
// console.log('Prompt Simulado:', promptSimulado);

// 3. Gerar prompt para flashcards
// const promptFlashcards = getPrompt('flashcards', 'Sistema Solar');
// console.log('Prompt Flashcards:', promptFlashcards);

// 4. Gerar prompt para material completo
// const promptCompleto = getPrompt('subject', 'Equações do Segundo Grau');
// console.log('Prompt Completo:', promptCompleto);