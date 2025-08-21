import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchNotes } from '../../store/note-slice/notesSlice';
import { Link } from 'react-router-dom';

const NotesList = () => {
    const dispatch = useAppDispatch();
    const { notes, loading } = useAppSelector(state => state.notes);

    useEffect(() => { dispatch(fetchNotes()) }, [dispatch]);
    console.log(notes);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full justify-center">
            <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-20">Notes</h1>
            <div className="flex flex-col w-full max-w-[900px] mx-auto px-4 py-[0px] text-left">

                <ul>
                    {notes.map(note => (
                        <li key={note._id}>
                            <Link to={`/note/${note._id}`}>
                                <div className='flex justify-between border-b pb-4 mb-5'>
                                    <h2 className='scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0'>{note.title}</h2>

                                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                                        {new Date(note.updatedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </h2>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>

        </div>


    );
};

export default NotesList;