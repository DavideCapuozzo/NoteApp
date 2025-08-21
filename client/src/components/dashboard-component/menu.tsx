import * as React from "react"
import { Pencil, LogOut, User } from "lucide-react"
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
import { useNavigate } from "react-router-dom"

export function Menu({ ...props }: React.ComponentProps<typeof any>) {

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();


  function handleLogout(){
      dispatch(logoutUser()).then((data:any)=>{
        toast.success(data?.payload?.message);
      })
      
  }

  return (
    <header className="w-full flex justify-center">
      <div className="w-full max-w-[900px] flex items-center justify-between px-4 py-[90px]">
        {/* Icona Matita */}
        <button className="flex items-center gap-2 hover:text-blue-600 transition cursor-pointer">
          <Pencil className="h-6 w-6" onClick={() => navigate('/note')}/>
        </button>

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