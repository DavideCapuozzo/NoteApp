import { useEffect, useState, useRef } from "react";
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
import NoteInput, { NoteInputHandle } from "./input";
import AiInput from "./ai-input";
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";


export default function LayoutNote() {
  const navigate = useNavigate();
  const [aiInputHeight, setAiInputHeight] = useState(50); // Altezza iniziale della chat chiusa
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const noteInputRef = useRef<NoteInputHandle>(null);

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
    toast.loading('Salvataggio in corso...');
    if (currentNote) {
      dispatch(updateNote({ id: currentNote._id, note: { title, content } }))
        .then(() => {
          toast.dismiss();
          toast.success('Nota aggiornata con successo');
          navigate('/myuser');
        });
    } else {
      dispatch(createNote({ title, content }))
        .then((result:any) => {
          setTitle("");
          setContent("");
          toast.dismiss();
          toast.success('Nota creata con successo');
          // Naviga direttamente alla nota appena creata
          if(result?.payload?._id){
            navigate(`/note/${result.payload._id}`);
          } else {
            navigate('/myuser');
          }
        });
    }
  };

  const handleDelete = () => {
    if (currentNote) {
      dispatch(deleteNote(currentNote._id));
      navigate('/myuser');
      toast.success('Nota eliminata con successo');
    }
  };

  // Gestisce l'upload del testo dall'AI alla nota nella posizione del cursore
  const handleUploadToNote = (text: string) => {
    if (text && noteInputRef.current) {
      noteInputRef.current.insertTextAtCursor(text);
      toast.success('Testo inserito nella posizione del cursore');
    }
  };

  if (loading) return <div>Caricamento...</div>;

  return (
    <div className="flex flex-col bg-[#fdfdfc] justify-center">
      <NoteMenu 
        onSave={handleSave} 
        onDelete={handleDelete} 
        noteTitle={title}
        noteContent={content}
      />
      {/* Passiamo la nota caricata (o undefined) a NoteInput */}
      <NoteInput
        ref={noteInputRef}
        aiInputHeight={aiInputHeight}
        note={currentNote || undefined}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
      />
      <AiInput 
        onHeightChange={setAiInputHeight}
        onUploadToNote={handleUploadToNote}
      />
    </div>
  );
}
