import * as React from "react"
import { Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Save, Download } from "lucide-react"
import { FaTimes } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch } from 'react-redux'
import { logoutUser, resetAuth } from '../../store/auth-slice/index';
import { toast } from 'sonner'
import type { AppDispatch } from '../../store/store'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function NoteMenu({ onSave, onDelete, noteTitle, noteContent }: { 
  onSave: () => void; 
  onDelete: () => void;
  noteTitle?: string;
  noteContent?: string;
}) {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  function handleLogout(){
    dispatch(logoutUser()).then((data:any)=>{
      // Reset dello stato auth e notes
      dispatch(resetAuth());
      dispatch({ type: 'notes/resetNotes' });
      toast.success(data?.payload?.message);
    });
  }

  function handleClose(){
    navigate('/myuser');
  }

  function handleDownload(){
    if (!noteTitle && !noteContent) {
      toast.error('Nessun contenuto da scaricare');
      return;
    }

    // Crea il contenuto del file txt
    const txtContent = `${noteTitle || 'Nota senza titolo'}\n${'='.repeat((noteTitle || 'Nota senza titolo').length)}\n\n${noteContent || ''}`;
    
    // Crea un blob con il contenuto
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    
    // Crea un URL temporaneo per il download
    const url = window.URL.createObjectURL(blob);
    
    // Crea un elemento anchor temporaneo per il download
    const link = document.createElement('a');
    link.href = url;
    
    // Nome del file basato sul titolo della nota
    const fileName = noteTitle || 'Nota senza titolo';
    link.download = `${fileName}.txt`;
    
    // Simula il click per avviare il download
    document.body.appendChild(link);
    link.click();
    
    // Pulizia
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Download completato');
  }

  return (
    <header className="w-full flex justify-center">
      <div className="w-full max-w-[900px] flex items-center justify-between px-4 py-[90px]">
        {/* Icone a sinistra */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 hover:text-[#2FCCC3] transition cursor-pointer" onClick={handleClose}>
            <Tooltip>
              <TooltipTrigger><FaTimes className="h-6 w-6" /></TooltipTrigger>
              <TooltipContent>
                <p>Close</p>
              </TooltipContent>
            </Tooltip>

            
          </button>
          <button className="flex items-center gap-2 hover:text-[#2FCCC3] transition cursor-pointer" onClick={onSave}>
            
            <Tooltip>
              <TooltipTrigger><Save className="h-6 w-6" strokeWidth={2} /></TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          </button>
          <button className="flex items-center gap-2 hover:text-red-600 transition cursor-pointer" title="Delete" onClick={onDelete}>
            
            <Tooltip>
              <TooltipTrigger><Trash2 className="h-6 w-6" strokeWidth={2} /></TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </button>
          <button className="flex items-center gap-2 hover:text-[#2FCCC3] transition cursor-pointer" title="Download" onClick={handleDownload}>
            
            <Tooltip>
              <TooltipTrigger><Download className="h-6 w-6" strokeWidth={2} /></TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </button>
        </div>

        {/* Menu Utente */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Gestisci profilo</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={handleLogout} className="cursor-pointer">
                <div className="flex">
                  <LogOut className="mr-4" />
                  <span>Logout</span>
                </div>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}