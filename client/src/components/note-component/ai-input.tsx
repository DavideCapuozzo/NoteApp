import { BrainCircuit } from 'lucide-react';
import { motion, useAnimation } from "motion/react";
import React, { useState, useRef, useLayoutEffect } from "react";
import { FaTimes, FaRegPaperPlane, FaUpload } from "react-icons/fa"; // <-- add FaUpload

export default function AiInput(props: React.ComponentProps<"div">) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number>(50); // altezza dinamica parent
  const [radius, setRadius] = useState<number>(50); // border radius
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const minTextarea = 32; // min altezza textarea
  const iconsHeight = 56; // icone + padding
  const extraPadding = 32;
  const minParentHeight = minTextarea + iconsHeight + extraPadding;

  

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
                    maxHeight: "320px"
                  }}
                  animate={{ height: textareaRef.current ? textareaRef.current.style.height : `${minTextarea}px` }}
                  transition={{ duration: 0.3 }}
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



/* export default function AiInput(props: React.ComponentProps<'div'>) {
    const [value, setValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        adjustHeight(e.target);
    };

    const handleSend = () => {
        if (value.trim() === "") return;
        setIsGenerating(true);

        setTimeout(() => {
            setIsGenerating(false);
            setValue("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }, 1500);
    };

    const handleStop = () => {
        setIsGenerating(false);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#f7f7f8] dark:bg-[#343541] border-t border-gray-200 dark:border-gray-700 px-2 py-4 flex justify-center z-50">
            <div className="relative flex items-end w-full max-w-2xl">
                <button
                    className="absolute left-2 bottom-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    type="button"
                    tabIndex={-1}
                >
                    <FaPlus size={18} />
                </button>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleInput}
                    rows={1}
                    placeholder="Send a message..."
                    className="w-full pl-8 pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#40414f] text-gray-900 dark:text-white resize-none outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    style={{
                        minHeight: "44px",
                        maxHeight: "200px",
                        overflowY: "auto",
                    }}
                    disabled={isGenerating}
                />
                <div className="absolute right-2 bottom-2 flex items-center">
                    {isGenerating ? (
                        <>
                            <button
                                className="text-red-500 hover:text-red-700 mr-2"
                                onClick={handleStop}
                                type="button"
                            >
                                <FaStop size={18} />
                            </button>
                            <FiLoader className="animate-spin text-gray-400" size={18} />
                        </>
                    ) : (
                        <button
                            className={`text-blue-500 hover:text-blue-700 ${value.trim() ? "" : "opacity-50 cursor-not-allowed"}`}
                            onClick={handleSend}
                            type="button"
                            disabled={!value.trim()}
                        >
                            <FaRegPaperPlane size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} */


