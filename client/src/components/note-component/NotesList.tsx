import React, { useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchNotes } from '../../store/note-slice/notesSlice';

const LIMIT = 10;

// Funzione per troncare il titolo
const truncateTitle = (title: string, maxLength: number = 30): string => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
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
            <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-20">Notes</h1>
            <div className="flex flex-col w-full max-w-[900px] mx-auto px-4 py-[0px] text-left">
                <ul>
                    {notes.map((note, idx) => {
                        if (idx === notes.length - 1) {
                            return (
                                <li key={note._id} ref={lastNoteRef}>
                                    <Link to={`/note/${note._id}`}>
                                        <div className='flex justify-between border-b pb-4 mb-5'>
                                            <h2 className='scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0'>{truncateTitle(note.title)}</h2>
                                            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                                                {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : ''}
                                            </h2>
                                        </div>
                                    </Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={note._id}>
                                    <Link to={`/note/${note._id}`}>
                                        <div className='flex justify-between border-b pb-4 mb-5'>
                                            <h2 className='scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0'>{truncateTitle(note.title)}</h2>
                                            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                                                {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : ''}
                                            </h2>
                                        </div>
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
                {/* Loader solo per la paginazione, non per il caricamento iniziale */}
                {loading && notes.length > 0 && (
                    <div className="text-center py-4 animate-pulse text-blue-600">Caricamento altre note...</div>
                )}
            </div>
        </div>
    );
};

export default NotesList;