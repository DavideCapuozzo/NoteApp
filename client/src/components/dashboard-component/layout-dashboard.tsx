import { Menu } from "./menu"
import { Footer } from "./footer"
import { Home } from "./home"
import { useNavigate } from "react-router-dom";
import React from "react";
import NotesList from "../note-component/NotesList";
import { useAppSelector } from "../../hooks";

export default function LayoutDashboard() {

  const navigate = useNavigate();
  // Use the useAppSelector hook to access the Redux state if needed
  const { notes, loading } = useAppSelector(state => state.notes);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <Menu />

      {notes && notes.length > 0 ? <NotesList /> : <Home onClick={() => navigate('/note')}/>}

      <Footer />
    </div>
  )
}

