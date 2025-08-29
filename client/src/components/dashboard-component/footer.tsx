import * as React from "react"


export function Footer() {
    return (
        <footer className="w-full text-sm text-gray-600 mt-auto">
            <div className="w-full max-w-[1200px] mx-auto flex items-center justify-center gap-6 px-4 py-8">
                <a href="/about" className="hover:text-[#2FCCC3] transition">About</a>
                <a href="/import" className="hover:text-[#2FCCC3] transition">Import</a>
            </div>
        </footer>
    )
}