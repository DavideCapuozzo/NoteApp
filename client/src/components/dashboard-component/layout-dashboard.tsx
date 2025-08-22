import { Menu } from "./menu"
import { Footer } from "./footer"
import { Home } from "./home"
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
    if (isAuthenticated) {
      dispatch(fetchNotes());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
        <Menu />
        <div className="flex flex-1 items-center justify-center text-2xl font-bold">Caricamento...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <Menu />
      {notes && notes.length > 0 ? <NotesList notes={notes} /> : <Home />}
      <Footer />
    </div>
  );
}

