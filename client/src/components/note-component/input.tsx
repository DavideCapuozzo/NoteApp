import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { createNote, updateNote } from "../../store/note-slice/notesSlice";

type NoteInputProps = {
    aiInputHeight: number;
    note?: { _id: string; title: string; content: string };
};

export default function NoteInput({ aiInputHeight, note }: NoteInputProps) {
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useAppDispatch();

    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");

    // Aggiorna il form se cambia la nota
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note]);

    const adjustHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    // Adatta altezza dei textarea inizialmente e quando cambia testo
    useEffect(() => {
        adjustHeight(titleRef.current);
        adjustHeight(contentRef.current);
    }, [title, content]);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight(e.currentTarget);
    };

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
                    className="italic outline-none font-bold mb-6 w-full overflow-hidden hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words text-[30px]"
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
                    className="w-full rounded-none outline-none resize-none hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words hyphens-auto text-[25px]"
                    placeholder="Scrivi il contenuto della nota qui..."
                    onInput={handleInput}
                    style={{
                        overflow: "hidden",
                        overflowWrap: "break-word",
                        textAlign: "start",
                        marginBottom: `${aiInputHeight + 150}px`
                    }}
                />
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Salva
                </button>
            </div>
        </form>
    );
}
