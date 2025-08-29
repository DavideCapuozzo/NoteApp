import { BrainCircuit } from 'lucide-react';
import { motion, useAnimation } from "motion/react";
import React, { useState, useRef, useLayoutEffect } from "react";
import { FaTimes, FaRegPaperPlane, FaUpload } from "react-icons/fa";
import { useGeminiChat } from '../../hooks/useGeminiChat';

type AiInputProps = { 
  onHeightChange?: (h: number) => void;
  onUploadToNote?: (text: string) => void;
};
export default function AiInput(props: AiInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number>(50); // altezza dinamica parent
  const [radius, setRadius] = useState<number>(50); // border radius
  const [message, setMessage] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const minTextarea = 32; // min altezza textarea
  const iconsHeight = 56; // icone + padding
  const extraPadding = 32; // Padding base, i margini dinamici vengono aggiunti in calculateTotalHeight
  const minParentHeight = minTextarea + iconsHeight + extraPadding;
  const maxMessagesHeight = 400; // Altezza massima per l'area messaggi

  // Hook per gestire la chat con Gemini
  const { messages, isLoading, error, sendMessage, clearMessages } = useGeminiChat();

  // Aggiorna il parent ogni volta che height cambia
  React.useEffect(() => {
    if (props.onHeightChange) props.onHeightChange(height);
  }, [height]);

  

  const calculateTotalHeight = () => {
    if (!isOpen) return 50;

    let totalHeight = minParentHeight;
    let isMessageAreaFull = false;

    // Aggiungi altezza dell'area messaggi se ci sono messaggi
    if (messages.length > 0 && messagesRef.current) {
      const actualMessagesHeight = messagesRef.current.scrollHeight;
      const usedMessagesHeight = Math.min(actualMessagesHeight + 16, maxMessagesHeight); // +16 per margin
      totalHeight += usedMessagesHeight;
      
      // Determina se l'area messaggi è piena (ha raggiunto il limite e ha bisogno di scroll)
      isMessageAreaFull = actualMessagesHeight > maxMessagesHeight;
    }

    // Aggiungi altezza dell'area errore se presente
    if (error) {
      totalHeight += 40; // Altezza approssimativa del div errore
    }

    // Aggiungi altezza del textarea se più grande del minimo
    if (textareaRef.current) {
      const textareaHeight = Math.max(minTextarea, Math.min(textareaRef.current.scrollHeight, 160));
      totalHeight = totalHeight - minTextarea + textareaHeight;
    }

    // Aggiungi margine fisso per le icone
    totalHeight += isMessageAreaFull ? 20 : 10; // 20px quando è piena, 10px quando non è piena

    return totalHeight;
  };

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = "auto";
      // Limito la textarea a max 160px per lasciare più spazio ai messaggi
      const scrollH = Math.max(minTextarea, Math.min(element.scrollHeight, 160));
      element.style.height = `${scrollH}px`;
    }
    
    // Ricalcola l'altezza totale
    const newHeight = calculateTotalHeight();
    setHeight(newHeight);
    setRadius(newHeight > 100 ? 20 : 50);
  };

  // Effetto per ricalcolare l'altezza quando cambiano i messaggi
  useLayoutEffect(() => {
    if (isOpen) {
      const newHeight = calculateTotalHeight();
      setHeight(newHeight);
      setRadius(newHeight > 100 ? 20 : 50);
    }
  }, [messages, error, isLoading, isOpen]);

  // Effetto per auto-scroll quando arriva una nuova risposta AI
  useLayoutEffect(() => {
    if (messagesRef.current && messages.length > 0) {
      // Controlla se l'ultimo messaggio è dell'AI
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Scroll verso il fondo con un piccolo ritardo per assicurarsi che il DOM sia aggiornato
        setTimeout(() => {
          if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
          }
        }, 100);
      }
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (isOpen && textareaRef.current) {
      // All’apertura: minHeight sufficiente per textarea vuota + icone + padding
      setHeight(minParentHeight);
      setRadius(20);
      textareaRef.current.style.height = `${minTextarea}px`;
    } else {
      setHeight(50);
      setRadius(50);
    }
  }, [isOpen]);
  
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    adjustHeight(e.currentTarget);
    setMessage(e.currentTarget.value);
  };

  // Gestisce l'invio del messaggio all'AI
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    try {
      const userMessage = message;
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.value = '';
        adjustHeight(textareaRef.current);
      }

      // Scroll verso il fondo dopo aver inviato il messaggio utente
      setTimeout(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }, 50);

      // Invia il messaggio - ora il contesto viene costruito dalla cronologia dei messaggi
      await sendMessage(userMessage);
    } catch (err) {
      console.error('Errore nell\'invio del messaggio:', err);
    }
  };

  // Gestisce il tasto Enter per inviare il messaggio
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gestisce il pulsante Upload per trasferire il testo selezionato
  const handleUpload = () => {
    if (selectedText && props.onUploadToNote) {
      props.onUploadToNote(selectedText);
      setSelectedText('');
    } else {
      // Se non c'è testo selezionato, prendi l'ultima risposta dell'AI
      const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();
      if (lastAiMessage && props.onUploadToNote) {
        props.onUploadToNote(lastAiMessage.content);
      }
    }
  };

  // Gestisce la selezione del testo
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    }
  };

  return (
    <div className="fixed left-0 bottom-0 w-full z-50 flex justify-center pointer-events-none mb-5">
      <div className="flex flex-col w-full max-w-[900px] px-4 py-0 relative pointer-events-auto">
        <motion.div
          layout
          data-isopen={isOpen}
          initial={{ borderRadius: 50, width: 50, height: 50 }}
          animate={{ height, borderRadius: radius, width: isOpen ? "100%" : 50 }}
          transition={{ duration: 0.3 }}
          className="parent border-[#000000] border-[1px] w-full flex items-start transition-all duration-300 overflow-hidden relative bg-[#fdfdfc]"
          style={{
            height: height,
            minHeight: isOpen ? height : 50,
            backgroundColor: "#fdfdfc",
            borderRadius: radius,
          }}
        >
          {/* Icona apertura/chiusura */}
          {!isOpen && (
            <motion.div
              layout
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(true)}
              className="bg-[#000000] p-3 rounded-[20px] flex items-center justify-center h-[40px] w-[40px] cursor-pointer"
              style={{
                position: "absolute",
                bottom: 5,
                left: 5,
              }}
            >
              <BrainCircuit color="white" size={20} />
            </motion.div>
          )}

          {isOpen && (
            <div className="w-full flex flex-col gap-2 px-2 pt-4 pb-2">
              {/* Area messaggi chat */}
              {messages.length > 0 && (
                <div 
                  ref={messagesRef}
                  className="overflow-y-auto mb-2 space-y-2" 
                  onMouseUp={handleTextSelection}
                  style={{ maxHeight: `${maxMessagesHeight}px` }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-100 dark:bg-blue-900 ml-8'
                          : 'bg-gray-100 dark:bg-gray-800 mr-8'
                      }`}
                    >
                      <div className={`font-semibold text-xs mb-1 ${
                        msg.role === 'user' ? 'text-[#2FCCC3] dark:text-blue-300' : 'text-gray-700 dark:text-[#000000]'
                      }`}>
                        {msg.role === 'user' ? 'Tu' : 'AI'}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-gray-100 dark:bg-gray-800 mr-8 p-2 rounded-lg text-sm">
                      <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-[#000000]">AI</div>
                      <div className="flex items-center space-x-1">
                        <div className="animate-pulse">Sto pensando...</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Errore */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-2">
                  {error}
                </div>
              )}

              {/* Riga 1: textarea */}
              <div className="w-full flex flex-row">
                <motion.textarea
                  ref={textareaRef}
                  autoComplete="off"
                  spellCheck={false}
                  rows={1}
                  value={message}
                  className="w-full rounded-none outline-none resize-none hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-transparent break-words hyphens-auto text-[14px] z-0"
                  placeholder="Ask a question ..."
                  style={{
                    overflowY: "auto",
                    overflowWrap: "break-word",
                    textAlign: "start",
                    minHeight: `${minTextarea}px`,
                    maxHeight: "160px", // Riduciamo un po' l'altezza max del textarea per dare più spazio ai messaggi
                  }}
                  onInput={handleInput}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
              {/* Riga 2: icone animate con motion.div */}
              <motion.div
                layout
                transition={{ duration: 0.3 }}
                className="w-full flex flex-row justify-between items-center pt-2 z-10"
                style={{ 
                  marginBottom: messagesRef.current && messagesRef.current.scrollHeight > maxMessagesHeight ? '20px' : '10px'
                }}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="bg-[#000000] p-3 rounded-[20px] flex items-center justify-center h-[40px] w-[40px]"
                    aria-label="Chiudi"
                    onClick={() => {
                      setIsOpen(false);
                      clearMessages();
                      setMessage('');
                      setSelectedText('');
                    }}
                  >
                    <FaTimes className="h-5 w-5 text-white" />
                  </button>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      className="bg-gray-500 p-2 rounded-[15px] flex items-center justify-center h-[30px] px-3"
                      aria-label="Cancella chat"
                      onClick={clearMessages}
                    >
                      <span className="text-white text-xs">Clear</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className={`transition-colors ${
                      selectedText || messages.some(m => m.role === 'assistant')
                        ? 'text-[#55EAE2] hover:text-[#2FCCC3]'
                        : 'text-[#000000]'
                    }`}
                    style={{ fontSize: 20 }}
                    tabIndex={-1}
                    aria-label="Upload to note"
                    onClick={handleUpload}
                    disabled={!selectedText && !messages.some(m => m.role === 'assistant')}
                    title={selectedText ? 'Upload testo selezionato' : 'Upload ultima risposta AI'}
                  >
                    <FaUpload />
                  </button>
                  <button
                    type="button"
                    className={`transition-colors ${
                      message.trim() && !isLoading
                        ? 'text-[#000000] hover:text-[#2FCCC3]'
                        : 'text-[#000000]'
                    }`}
                    style={{ fontSize: 22 }}
                    aria-label="Send"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                  >
                    <FaRegPaperPlane />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

