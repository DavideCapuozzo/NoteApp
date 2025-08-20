import React, { useRef, useEffect } from "react";

export default function NoteInput() {
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight(titleRef.current);
        adjustHeight(contentRef.current);
    }, []);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight(e.currentTarget);
    };

    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col w-full max-w-[900px] items-center justify-between px-4 py-[0px] ">
                <textarea
                    ref={titleRef}
                    autoComplete="off"
                    spellCheck={false}
                    className="italic outline-none font-bold mb-6 w-full overflow-hidden hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words text-[30px]"
                    placeholder="Inferno, canto primo"
                    rows={1}
                    onInput={handleInput}
                    style={{ overflowX: "hidden", overflowWrap: "break-word", resize: "none" }}
                />
                <textarea
                    ref={contentRef}
                    autoComplete="off"
                    spellCheck={false}
                    rows={1}
                    className="w-full rounded-none outline-none resize-none hover:placeholder:opacity-50 focus:placeholder:opacity-0 bg-[#fdfdfc] dark:bg-neutral-900 break-words hyphens-auto text-[25px] mb-10"
                    placeholder="Mother died today. Or, maybe, yesterday; I can't be sure. The telegram from the Home says: YOUR MOTHER PASSED AWAY. FUNERAL TOMORROW. DEEP SYMPATHY. Which leaves the matter doubtful; it could have been yesterday."
                    onInput={handleInput}
                    style={{ overflow: "hidden", overflowWrap: "break-word", textAlign: "start" }}
                />
            </div>
        </div>
    );
}
