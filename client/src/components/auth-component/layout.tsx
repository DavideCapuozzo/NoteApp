import { Outlet, Link } from "react-router-dom"
import { Pencil } from "lucide-react";
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium hover:opacity-80 transition">
            <Pencil className="h-6 w-6" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <video
          src="https://res.cloudinary.com/divuubyft/video/upload/v1747339395/10822-226624975_mvta9m.mp4"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  )
}