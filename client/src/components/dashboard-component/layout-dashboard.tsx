import { Menu } from "./menu"
import { Footer } from "./footer"
import { Home } from "./homeDash"
import { useNavigate } from "react-router-dom";
import React from "react";
import NotesList from "../note-component/NotesList";
import { useAppSelector } from "../../hooks";
import { useAppDispatch } from "../../hooks";
import { fetchNotes } from "@/store/note-slice/notesSlice";

export default function LayoutDashboard() {
  const dispatch = useAppDispatch();
  const { notes, loading } = useAppSelector(state => state.notes);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  React.useEffect(() => {
    if (isAuthenticated && notes.length === 0 && !loading) {
      dispatch(fetchNotes({ page: 1, limit: 10 }));
    }
  }, [isAuthenticated, dispatch, notes.length, loading]);


  // Rimuovo il blocco di loading globale: il caricamento viene gestito solo in NotesList

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <Menu />
      {isAuthenticated && notes && notes.length > 0 ? <NotesList notes={notes} /> : <NotesList notes={[]} />}
      <Footer />
    </div>
  );
}

