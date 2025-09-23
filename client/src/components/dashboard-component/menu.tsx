import * as React from "react"
import { Pencil, LogOut, User, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch } from 'react-redux'
import { logoutUser, resetAuth } from '../../store/auth-slice'
import { toast } from 'sonner'
import type { AppDispatch } from '../../store/store'
import { useNavigate } from "react-router-dom"
import { ImportDialog } from './import-dialog'

export function Menu({ ...props }: React.ComponentProps<'div'>) {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();


  function handleLogout(){
      dispatch(logoutUser()).then((data:any)=>{
        // Reset dello stato auth e notes
        dispatch(resetAuth());
        dispatch({ type: 'notes/resetNotes' });
        toast.success(data?.payload?.message);
      })
      
  }

  return (
    <header className="w-full flex justify-center">
      <div className="w-full max-w-[900px] flex items-center justify-between px-4 py-[40px] md:py-[90px] lg:py-[90px]">
        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Icona Matita */}
          <button className="flex items-center gap-2 hover:text-[#2FCCC3] transition cursor-pointer">
            <Pencil className="h-6 w-6" onClick={() => navigate('/note')}/>
          </button>
          
          {/* Pulsante Import */}
          <ImportDialog>
            <Button variant="ghost" size="sm" className="hover:text-[#2FCCC3] transition">
              <Upload className="h-5 w-5" />
            </Button>
          </ImportDialog>
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