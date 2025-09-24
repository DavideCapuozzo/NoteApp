import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useAppDispatch } from "../../hooks";
import { createNote, updateNote } from "../../store/note-slice/notesSlice";

type NoteInputProps = {
    aiInputHeight: number;
    note?: { _id: string; title: string; content: string };
    title: string;
    setTitle: (t: string) => void;
    content: string;
    setContent: (c: string) => void;
    onTypingChange?: (isTyping: boolean) => void;
};

export type NoteInputHandle = {
    insertTextAtCursor: (text: string) => void;
};

const NoteInput = forwardRef<NoteInputHandle, NoteInputProps>(({ aiInputHeight, note, title, setTitle, content, setContent, onTypingChange }, ref) => {
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useAppDispatch();
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Aggiorna il form se cambia la nota
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note, setTitle, setContent]);

    const adjustHeight = (element: HTMLTextAreaElement | null, preserveViewport?: boolean) => {
        if (element) {
            const oldHeight = element.style.height;
            element.style.height = "auto";
            const newHeight = element.scrollHeight;
            element.style.height = `${newHeight}px`;
            
            // Se non dobbiamo preservare il viewport, mantieni il comportamento normale
            if (!preserveViewport) {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                window.scrollTo(scrollLeft, scrollTop);
            }
        }
    };

    // Adatta altezza dei textarea inizialmente e quando cambia testo
    useEffect(() => {
        adjustHeight(titleRef.current, false);
        adjustHeight(contentRef.current, false);
    }, [title, content]);

    // Forza il re-render quando cambia l'altezza dell'AI input
    useEffect(() => {
        /* console.log('AI Input Height changed to:', aiInputHeight); */
    }, [aiInputHeight]);

    // Cleanup del timeout quando il componente viene smontato
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        // Salva la posizione del cursore prima del ridimensionamento
        const cursorPosition = e.currentTarget.selectionStart;
        const targetElement = e.currentTarget; // Salva il riferimento
        
        adjustHeight(targetElement, false);
        
        // Ripristina la posizione del cursore senza causare scroll
        setTimeout(() => {
            if (targetElement) {
                targetElement.setSelectionRange(cursorPosition, cursorPosition);
            }
        }, 0);

        // Gestione dello stato di digitazione
        if (onTypingChange) {
            // Notifica che l'utente sta digitando
            onTypingChange(true);
            
            // Cancella il timeout precedente se esiste
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Imposta un nuovo timeout per rilevare quando l'utente smette di digitare
            typingTimeoutRef.current = setTimeout(() => {
                onTypingChange(false);
            }, 1000); // Aspetta 1 secondo di inattività
        }
    };

    // Funzione per inserire testo nella posizione del cursore
    const insertTextAtCursor = (text: string) => {
        const activeElement = document.activeElement;
        let targetTextArea: HTMLTextAreaElement | null = null;
        let setValue: (value: string) => void = setContent;

        // Determina quale textarea è attiva
        if (activeElement === titleRef.current) {
            targetTextArea = titleRef.current;
            setValue = setTitle;
        } else if (activeElement === contentRef.current || !activeElement) {
            targetTextArea = contentRef.current;
            setValue = setContent;
        } else {
            // Se nessuna textarea è focusata, usa quella del contenuto
            targetTextArea = contentRef.current;
            setValue = setContent;
        }

        if (targetTextArea) {
            // Salva lo stato corrente prima dell'inserimento
            const cursorPosition = targetTextArea.selectionStart;
            const currentValue = targetTextArea.value;
            
            // Calcola il nuovo valore
            const newValue = 
                currentValue.slice(0, cursorPosition) + 
                text + 
                currentValue.slice(targetTextArea.selectionEnd);
            
            // Salva la posizione di scroll corrente del viewport
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const currentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            // Aggiorna il valore
            setValue(newValue);
            
            // Usa requestAnimationFrame per assicurarsi che l'aggiornamento sia completato
            requestAnimationFrame(() => {
                if (targetTextArea) {
                    // Mantieni il focus e posiziona il cursore alla fine del testo inserito
                    targetTextArea.focus();
                    const newCursorPosition = cursorPosition + text.length;
                    targetTextArea.setSelectionRange(newCursorPosition, newCursorPosition);
                    
                    // Aggiusta l'altezza preservando il viewport
                    adjustHeight(targetTextArea, true);
                    
                    // Ripristina esattamente la posizione di scroll precedente
                    window.scrollTo(currentScrollLeft, currentScrollTop);
                    
                    // Assicurati che il cursore sia visibile nel textarea
                    // Scorri il textarea internamente per mostrare la fine del testo
                    targetTextArea.scrollTop = targetTextArea.scrollHeight;
                }
            });
        }
    };

    // Espone la funzione al componente padre tramite ref
    useImperativeHandle(ref, () => ({
        insertTextAtCursor
    }));

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (note) {
            dispatch(updateNote({ id: note._id, note: { title, content } }));
        } else {
            dispatch(createNote({ title, content }));
            setTitle("");
            setContent("");
        }
    };

    return (
        <form
            onSubmit={handleSave}
            className="w-full flex justify-center"
        >
            <div className="flex flex-col w-full max-w-[900px] items-center justify-between px-4 py-[0px] ">
                <textarea
                    ref={titleRef}
                    autoComplete="off"
                    spellCheck={false}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="italic outline-none font-bold mb-6 w-full overflow-hidden hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words text-[30px] font-heading"
                    placeholder="What is Lorem Ipsum?"
                    rows={1}
                    onInput={handleInput}
                    style={{ overflowX: "hidden", overflowWrap: "break-word", resize: "none" }}
                />
                <textarea
                    ref={contentRef}
                    autoComplete="off"
                    spellCheck={false}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={1}
                    className="w-full rounded-none outline-none resize-none hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words hyphens-auto text-[25px] font-body"
                    placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                    onInput={handleInput}
                    style={{
                        minHeight: "500px", // Altezza minima per iniziare
                        overflow: "visible", // Espansione naturale, nessun scroll interno
                        overflowWrap: "break-word",
                        textAlign: "start",
                        marginBottom: `${aiInputHeight + 80}px`, // Margin sempre dinamico basato sull'altezza della chat
                        resize: "none"
                    }}
                />
            </div>
        </form>
    );
});

NoteInput.displayName = 'NoteInput';

export default NoteInput;
