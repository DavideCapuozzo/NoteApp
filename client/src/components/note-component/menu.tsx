import * as React from "react"
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
import { logoutUser } from '../../store/auth-slice'
import { toast } from 'sonner'
import type { AppDispatch } from '../../store/store'

export default function NoteMenu(props: React.ComponentProps<'div'>) {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  function handleLogout(){
      dispatch(logoutUser()).then((data:any)=>{
        toast.success(data?.payload?.message);
      })
  }

  function handleClose(){
    navigate('/myuser');
  }

  return (
    <header className="w-full flex justify-center">
      <div className="w-full max-w-[900px] flex items-center justify-between px-4 py-[90px]">
        {/* Icone a sinistra */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 hover:text-blue-600 transition" title="Chiudi" onClick={handleClose}>
            <FaTimes className="h-6 w-6" />
          </button>
          <button className="flex items-center gap-2 hover:text-blue-600 transition" title="Salva">
            <Save className="h-6 w-6" strokeWidth={2} />
          </button>
          <button className="flex items-center gap-2 hover:text-blue-600 transition" title="Download">
            <Download className="h-6 w-6" strokeWidth={2} />
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