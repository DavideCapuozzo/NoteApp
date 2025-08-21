import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchNote, clearCurrentNote } from "../../store/note-slice/notesSlice";
import NoteMenu from "./menu";
import NoteInput from "./input";
import AiInput from "./ai-input";

export default function LayoutNote() {
  const [aiInputHeight, setAiInputHeight] = useState(150);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentNote, loading } = useAppSelector((state) => state.notes);

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

  if (loading) return <div>Caricamento...</div>;

  return (
    <div className="flex flex-col bg-[#fdfdfc] justify-center">
      <NoteMenu />
      {/* Passiamo la nota caricata (o undefined) a NoteInput */}
      <NoteInput aiInputHeight={aiInputHeight} note={currentNote || undefined} />
      <AiInput onHeightChange={setAiInputHeight} />
    </div>
  );
}
