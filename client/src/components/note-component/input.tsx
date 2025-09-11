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
};

export type NoteInputHandle = {
    insertTextAtCursor: (text: string) => void;
};

const NoteInput = forwardRef<NoteInputHandle, NoteInputProps>(({ aiInputHeight, note, title, setTitle, content, setContent }, ref) => {
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useAppDispatch();

    // Aggiorna il form se cambia la nota
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note, setTitle, setContent]);

    const adjustHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            // Salva la posizione di scroll corrente
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
            
            // Ripristina la posizione di scroll per evitare salti automatici
            window.scrollTo(scrollLeft, scrollTop);
        }
    };

    // Adatta altezza dei textarea inizialmente e quando cambia testo
    useEffect(() => {
        adjustHeight(titleRef.current);
        adjustHeight(contentRef.current);
    }, [title, content]);

    // Forza il re-render quando cambia l'altezza dell'AI input
    useEffect(() => {
        /* console.log('AI Input Height changed to:', aiInputHeight); */
    }, [aiInputHeight]);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        // Salva la posizione del cursore prima del ridimensionamento
        const cursorPosition = e.currentTarget.selectionStart;
        const targetElement = e.currentTarget; // Salva il riferimento
        
        adjustHeight(targetElement);
        
        // Ripristina la posizione del cursore senza causare scroll
        setTimeout(() => {
            if (targetElement) {
                targetElement.setSelectionRange(cursorPosition, cursorPosition);
            }
        }, 0);
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
            const cursorPosition = targetTextArea.selectionStart;
            const currentValue = targetTextArea.value;
            const newValue = 
                currentValue.slice(0, cursorPosition) + 
                text + 
                currentValue.slice(targetTextArea.selectionEnd);
            
            setValue(newValue);
            
            // Ripristina la posizione del cursore dopo l'inserimento
            setTimeout(() => {
                if (targetTextArea) {
                    targetTextArea.focus();
                    targetTextArea.setSelectionRange(
                        cursorPosition + text.length, 
                        cursorPosition + text.length
                    );
                    adjustHeight(targetTextArea);
                    
                    // Breve highlight del testo inserito per feedback visivo
                    targetTextArea.setSelectionRange(cursorPosition, cursorPosition + text.length);
                    setTimeout(() => {
                        targetTextArea.setSelectionRange(
                            cursorPosition + text.length, 
                            cursorPosition + text.length
                        );
                    }, 500);
                }
            }, 0);
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
                    placeholder="Titolo della nota"
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
                    placeholder="Scrivi il contenuto della nota qui..."
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
