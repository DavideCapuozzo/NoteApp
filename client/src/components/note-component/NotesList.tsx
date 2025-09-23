import React, { useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchNotes } from '../../store/note-slice/notesSlice';

const LIMIT = 10;

// Funzione per troncare il titolo con lunghezza dinamica per mobile
const truncateTitle = (title: string, maxLength: number = 30, isMobile: boolean = false): string => {
    const finalMaxLength = isMobile ? 20 : maxLength;
    if (title.length <= finalMaxLength) return title;
    return title.substring(0, finalMaxLength) + '...';
};

const NotesList = ({ notes }: { notes: any[] }) => {
    const dispatch = useAppDispatch();
    const { loading, hasMore, page } = useAppSelector(state => state.notes);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastNoteRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                dispatch(fetchNotes({ page: page + 1, limit: LIMIT }));
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, page, dispatch]);

    // La fetch iniziale viene gestita dalla dashboard, non qui

    return (
        <div className="w-full justify-center">
            <h1 className="text-center lg:text-5xl mb-20">Note.txt</h1>
            <div className="flex flex-col w-full max-w-[900px] mx-auto px-4 py-[0px] text-left">
                <ul>
                    {notes.map((note, idx) => {
                        if (idx === notes.length - 1) {
                            return (
                                <li key={note._id} ref={lastNoteRef}>
                                    <Link to={`/note/${note._id}`}>
                                        <div className='border-b pb-4 mb-5 border-[#e5e5e5]'>
                                            {/* Layout mobile: stack vertically */}
                                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                                                <h2 className='scroll-m-20 text-xl sm:text-3xl font-semibold tracking-tight first:mt-0 flex-1 min-w-0'>
                                                    <span className='sm:hidden'>{truncateTitle(note.title, 30, true)}</span>
                                                    <span className='hidden sm:inline'>{truncateTitle(note.title)}</span>
                                                </h2>
                                                <h2 className="scroll-m-20 text-sm sm:text-3xl font-semibold tracking-tight first:mt-0 text-gray-600 sm:text-black flex-shrink-0">
                                                    {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : ''}
                                                </h2>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={note._id}>
                                    <Link to={`/note/${note._id}`}>
                                        <div className='border-b pb-4 mb-5 border-[#e5e5e5]'>
                                            {/* Layout mobile: stack vertically */}
                                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                                                <h2 className='scroll-m-20 text-xl sm:text-3xl font-semibold tracking-tight first:mt-0 flex-1 min-w-0'>
                                                    <span className='sm:hidden'>{truncateTitle(note.title, 30, true)}</span>
                                                    <span className='hidden sm:inline'>{truncateTitle(note.title)}</span>
                                                </h2>
                                                <h2 className="scroll-m-20 text-sm sm:text-3xl font-semibold tracking-tight first:mt-0 text-gray-600 sm:text-black flex-shrink-0">
                                                    {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : ''}
                                                </h2>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
                {/* Loader solo per la paginazione, non per il caricamento iniziale */}
                {loading && notes.length > 0 && (
                    <div className="text-center py-4 animate-pulse text-[#2FCCC3]">Caricamento altre note...</div>
                )}
            </div>
        </div>
    );
};

export default NotesList;