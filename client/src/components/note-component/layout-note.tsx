import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteNote } from '../../store/note-slice/notesSlice';
import {
  fetchNote,
  clearCurrentNote,
  updateNote,
  createNote,
} from "../../store/note-slice/notesSlice";
import NoteMenu from "./menu";
import NoteInput from "./input";
import AiInput from "./ai-input";
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";


export default function LayoutNote() {
  const navigate = useNavigate();
  const [aiInputHeight, setAiInputHeight] = useState(150);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentNote, loading } = useAppSelector((state) => state.notes);
  const [title, setTitle] = useState(currentNote?.title || "");
  const [content, setContent] = useState(currentNote?.content || "");

  useEffect(() => {
    if (id) {
      dispatch(fetchNote(id));
    } else {
      dispatch(clearCurrentNote()); // Se non c'è id, stiamo creando una nuova nota
    }
    return () => {
      dispatch(clearCurrentNote());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleSave = () => {
    if (currentNote) {
      dispatch(updateNote({ id: currentNote._id, note: { title, content } }));
      navigate('/myuser');
      toast.success('Nota aggiornata con successo');
    } else {
      dispatch(createNote({ title, content }));
      setTitle("");
      setContent("");
      navigate('/myuser');
      toast.success('Nota creata con successo');
    }
  };

  const handleDelete = () => {
    if (currentNote) {
      dispatch(deleteNote(currentNote._id));
      navigate('/myuser');
      toast.success('Nota eliminata con successo');
    }
  };

  if (loading) return <div>Caricamento...</div>;

  return (
    <div className="flex flex-col bg-[#fdfdfc] justify-center">
      <NoteMenu onSave={handleSave} onDelete={handleDelete} />
      {/* Passiamo la nota caricata (o undefined) a NoteInput */}
      <NoteInput
        aiInputHeight={aiInputHeight}
        note={currentNote || undefined}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
      />
      <AiInput onHeightChange={setAiInputHeight} />
    </div>
  );
}
