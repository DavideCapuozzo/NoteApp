import * as React from "react"


export function Nota() {
    const [titolo, setTitolo] = React.useState("Lorem Ipsum")
    const [testo, setTesto] = React.useState("Lorem Ipsum il testo completo")


    return (
        <div className="flex flex-col max-w-xl mx-auto p-4 space-y-4">
            <input
                type="text"
                value={titolo}
                onChange={(e) => setTitolo(e.target.value)}
                className="border rounded-md px-3 py-2 text-lg font-semibold"
                placeholder="Titolo"
            />
            <textarea
                value={testo}
                onChange={(e) => setTesto(e.target.value)}
                className="border rounded-md px-3 py-2 text-gray-700 h-40 resize-none"
                placeholder="Testo"
            />
        </div>
    )
}