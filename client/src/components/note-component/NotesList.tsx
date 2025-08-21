import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchNotes, deleteNote } from '../../store/note-slice/notesSlice';
import { Link } from 'react-router-dom';

const NotesList = () => {
    const dispatch = useAppDispatch();
    const { notes, loading } = useAppSelector(state => state.notes);

    useEffect(() => { dispatch(fetchNotes()) }, [dispatch]);

    if(loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Le tue note</h2>
            <ul>
                {notes.map(note => (
                    <li key={note._id}>
                        <Link to={`/note/${note._id}`}>{note.title}</Link>
                        <button onClick={() => dispatch(deleteNote(note._id))}>Elimina</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesList;