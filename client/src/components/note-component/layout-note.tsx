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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";


export default function LayoutNote() {
  const navigate = useNavigate();
  const [aiInputHeight, setAiInputHeight] = useState(50); // Altezza iniziale della chat chiusa
  const [isTyping, setIsTyping] = useState(false); // Stato per tracciare se l'utente sta digitando
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const noteInputRef = useRef<NoteInputHandle>(null);

  const { currentNote, loading } = useAppSelector((state) => state.notes);
  const [title, setTitle] = useState(currentNote?.title || "");
  const [content, setContent] = useState(currentNote?.content || "");

  useEffect(() => {
    if (id) {
      // Solo fai la chiamata se non abbiamo già la nota corretta in currentNote
      if (!currentNote || currentNote._id !== id) {
        dispatch(fetchNote(id));
      }
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
    } else if (!id) {
      // Solo resetta i campi se stiamo creando una nuova nota (senza id)
      setTitle("");
      setContent("");
    }
  }, [currentNote, id]);

  const handleSave = () => {
    toast.loading('Saving in progress...');
    if (currentNote) {
      dispatch(updateNote({ id: currentNote._id, note: { title, content } }))
        .then(() => {
          toast.dismiss();
          toast.success('Note successfully updated');
          navigate('/myuser');
        });
    } else {
      dispatch(createNote({ title, content }))
        .then((result:any) => {
          if (result.type === 'notes/createNote/fulfilled') {
            toast.dismiss();
            toast.success('Note successfully created');
            // Naviga direttamente alla nota appena creata
            if(result?.payload?._id){
              navigate(`/note/${result.payload._id}`);
            } else {
              navigate('/myuser');
            }
          } else if (result.type === 'notes/createNote/rejected') {
            toast.dismiss();
            setErrorMessage(result.payload || 'Error while creating the note');
            setErrorDialogOpen(true);
          }
        })
        .catch((error: any) => {
          toast.dismiss();
          setErrorMessage('Error while creating the note');
          setErrorDialogOpen(true);
        });
    }
  };

  const handleDelete = () => {
    if (currentNote) {
      dispatch(deleteNote(currentNote._id));
      navigate('/myuser');
      toast.success('Note successfully deleted');
    }
  };

  // Gestisce l'upload del testo dall'AI alla nota nella posizione del cursore
  const handleUploadToNote = (text: string) => {
    if (text && noteInputRef.current) {
      noteInputRef.current.insertTextAtCursor(text);
      toast.success('Text inserted at cursor position');
    }
  };

  // Gestisce il cambio di stato della digitazione
  const handleTypingChange = (typing: boolean) => {
    setIsTyping(typing);
  };

  /* if (loading) return <div>Caricamento...</div>; */

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
        onTypingChange={handleTypingChange}
      />
      <div className="relative">
        <AiInput 
          onHeightChange={setAiInputHeight}
          onUploadToNote={handleUploadToNote}
          isVisible={!isTyping}
          noteTitle={title}
          noteContent={content}
        />
      </div>
      
      {/* Dialog per gli errori */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Errore</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600">
              {errorMessage}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setErrorDialogOpen(false)}>
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
