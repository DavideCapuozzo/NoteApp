import { GoogleGenerativeAI } from '@google/generative-ai';

// Inizializza Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY non trovata nelle variabili d\'ambiente');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  async sendMessage(message: string): Promise<string> {
    if (!API_KEY) {
      throw new Error('API Key di Gemini non configurata');
    }

    try {
      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Errore nella chiamata a Gemini:', error);
      throw new Error('Errore durante la comunicazione con l\'AI');
    }
  }

  async sendMessageWithContext(message: string, context: string): Promise<string> {
    if (!API_KEY) {
      throw new Error('API Key di Gemini non configurata');
    }

    const prompt = `Cronologia conversazione:
${context}

Nuova domanda dell'utente: ${message}

Rispondi alla domanda tenendo conto del contesto della conversazione precedente. Mantieni un tono naturale e coerente:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Errore nella chiamata a Gemini:', error);
      throw new Error('Errore durante la comunicazione con l\'AI');
    }
  }
}

export const geminiService = new GeminiService();
