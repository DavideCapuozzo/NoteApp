import { BrainCircuit } from 'lucide-react';
import { motion } from "motion/react";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"



export default function AiInput(props: React.ComponentProps<'div'>) {

    const [isOpen, setIsOpen] = useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight(e.currentTarget);
    };

    return (
        <div className="w-full flex justify-center mt-auto mb-12">
            <div className="flex flex-col w-full max-w-[900px] justify-between px-4 py-[0px] ">
                <motion.div layout data-isOpen={isOpen} initial={{ borderRadius: 50 }} style={{ borderRadius: 50 }} className='parent border-[#213547] border-[1px] rounded-[20px] min-h-[50px] max-h-[400px] w-[50px] flex items-center justify-center'>
                    <motion.div layout transition={{ duration: 1 }} onClick={() => setIsOpen(!isOpen)} className="bg-[#213547] p-3 rounded-[20px] flex items-center justify-center h-[40px] w-[40px]">
                        {
                            isOpen ?
                                <FaTimes className="h-5 w-5 text-white" />
                                :
                                <BrainCircuit color="white" size={20} />
                        }
                    </motion.div>
                    {
                        isOpen ?
                            <textarea
                                ref={textareaRef}
                                autoComplete="off"
                                spellCheck={false}
                                rows={1}
                                className="w-full rounded-none outline-none resize-none hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words hyphens-auto text-[16px] mx-2.5"
                                placeholder="Ask a question ..."
                                style={{ 
                                    overflow: "hidden", 
                                    overflowWrap: "break-word", 
                                    textAlign: "start",
                                    maxHeight: "320px", // 400px container - padding/margins
                                    overflowY: "auto"   // <-- add this line
                                }}
                                onInput={handleInput}
                            />
                            :
                            null
                    }

                </motion.div>
            </div>
        </div>
    )
}