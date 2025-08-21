import { BrainCircuit } from 'lucide-react';
import { motion, useAnimation } from "motion/react";
import React, { useState, useRef, useLayoutEffect } from "react";
import { FaTimes, FaRegPaperPlane, FaUpload } from "react-icons/fa"; // <-- add FaUpload

type AiInputProps = { onHeightChange?: (h: number) => void };
export default function AiInput(props: AiInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number>(50); // altezza dinamica parent
  const [radius, setRadius] = useState<number>(50); // border radius
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const minTextarea = 32; // min altezza textarea
  const iconsHeight = 56; // icone + padding
  const extraPadding = 32;
  const minParentHeight = minTextarea + iconsHeight + extraPadding;

  // Aggiorna il parent ogni volta che height cambia
  React.useEffect(() => {
    if (props.onHeightChange) props.onHeightChange(height);
  }, [height]);

  

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = "auto";
      // Limito la textarea a max 320px
      const scrollH = Math.max(minTextarea, Math.min(element.scrollHeight, 320));
      element.style.height = `${scrollH}px`;
      // Calcolo altezza parent: textarea + icone + padding, ma non meno di minParentHeight
      const newHeight = Math.max(scrollH + iconsHeight + extraPadding, minParentHeight);
      setHeight(newHeight);
      setRadius(newHeight > 100 ? 20 : 50);
    }
  };

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
  };

  return (
    <div className="fixed left-0 bottom-0 w-full z-50 flex justify-center pointer-events-none mb-5">
      <div className="flex flex-col w-full max-w-[900px] px-4 py-0 relative pointer-events-auto">
        <motion.div
          layout
          data-isOpen={isOpen}
          initial={{ borderRadius: 50, width: 50, height: 50 }}
          animate={{ height, borderRadius: radius, width: isOpen ? "100%" : 50 }}
          transition={{ duration: 0.3 }}
          className="parent border-[#213547] border-[1px] w-full flex items-start transition-all duration-300 overflow-hidden relative bg-[#fdfdfc]"
          style={{
            height: height,
            minHeight: isOpen ? height : 50,
            maxHeight: "320px",
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
              className="bg-[#213547] p-3 rounded-[20px] flex items-center justify-center h-[40px] w-[40px] cursor-pointer"
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
            <div className="w-full flex flex-col gap-2 px-2 py-4">
              {/* Riga 1: textarea */}
              <div className="w-full flex flex-row">
                <motion.textarea
                  ref={textareaRef}
                  autoComplete="off"
                  spellCheck={false}
                  rows={1}
                  className="w-full rounded-none outline-none resize-none hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-transparent break-words hyphens-auto text-[10px] z-0"
                  placeholder="Ask a question ..."
                  style={{
                    overflowY: "auto",
                    overflowWrap: "break-word",
                    textAlign: "start",
                    minHeight: `${minTextarea}px`,
                    maxHeight: "320px",
                    height: textareaRef.current ? textareaRef.current.style.height : `${minTextarea}px`
                  }}
                  onInput={handleInput}
                />
              </div>
              {/* Riga 2: icone animate con motion.div */}
              <motion.div
                layout
                transition={{ duration: 0.3 }}
                className="w-full flex flex-row justify-between items-center pt-2 z-10"
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    className="bg-[#213547] p-3 rounded-[20px] flex items-center justify-center h-[40px] w-[40px]"
                    aria-label="Chiudi"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaTimes className="h-5 w-5 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    style={{ fontSize: 20 }}
                    tabIndex={-1}
                    aria-label="Upload"
                  >
                    <FaUpload />
                  </button>
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    style={{ fontSize: 22 }}
                    aria-label="Send"
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

