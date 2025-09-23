import { useState, useCallback } from 'react';
import { geminiService, ChatMessage } from '../services/gemini';

export const useGeminiChat = (noteTitle?: string, noteContent?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Aggiungi il messaggio dell'utente
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      let response: string;
      
      // Se ci sono messaggi precedenti, costruisci il contesto dalla cronologia
      // Limita a massimo 10 messaggi precedenti per non sovraccaricare il contesto
      if (messages.length > 0) {
        const lastMessages = messages.slice(-10); // Prende gli ultimi 10 messaggi
        const conversationContext = lastMessages
          .map(msg => `${msg.role === 'user' ? 'Utente' : 'Assistant'}: ${msg.content}`)
          .join('\n');
        
        response = await geminiService.sendMessageWithNoteContext(message, conversationContext, noteTitle, noteContent);
      } else {
        // Se non ci sono messaggi precedenti ma abbiamo una nota, includiamola comunque
        if (noteTitle || noteContent) {
          response = await geminiService.sendMessageWithNoteContext(message, '', noteTitle, noteContent);
        } else {
          response = await geminiService.sendMessage(message);
        }
      }

      // Aggiungi la risposta dell'AI
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, noteTitle, noteContent]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
