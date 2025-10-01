import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export default function MenuHome({ ...props }: React.ComponentProps<'div'>) {
    return (
        <header className="w-full flex justify-center">
            <div className="w-full max-w-[900px] flex items-center justify-between px-4 py-[40px] md:py-[90px] lg:py-[90px]">
                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Icona Matita */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Pencil className="h-6 w-6" />
                    </Link>

                </div>
                <div className="flex flex-row items-center gap-2">
                    <Link className="" to="/auth/login">
                        Login
                    </Link>
                    <button className="px-4 py-2 bg-[#2FCCC3] text-white rounded hover:bg-[#26b2ad] transition"><Link className="!text-white" to='/auth/registration'>Sign up</Link></button>
                </div>
            </div>
        </header>
    );
}
