import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { loginUser } from "@/store/auth-slice"
import { Navigate } from "react-router-dom"


const initialState = {
  email: '',
  password: ''
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState)
  // const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    console.log("Form Data:", formData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)

    dispatch(loginUser(formData)).then((data) => {
      if(data?.payload?.success){
        toast.success(data?.payload?.message);
        navigate('/myuser')
      }else{
        toast.warning(data?.payload?.message);
      }
    });
  }





  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" /* variant="" */ >
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-white text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button /* variant="loginGoogle" */ className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
            <path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.3c-6.4 34.1-25.4 62.9-54.3 82.2v68.3h87.7c51.3-47.3 80.8-117.1 80.8-195.4z" fill="currentColor" />
            <path d="M272 544.3c73.5 0 135.2-24.3 180.2-66.1l-87.7-68.3c-24.3 16.3-55.3 25.9-92.5 25.9-71 0-131.2-47.9-152.8-112.2H29v70.4c45.2 89.3 137.9 150.3 243 150.3z" fill="currentColor" />
            <path d="M119.2 323.6c-10.6-31.6-10.6-65.7 0-97.3V156H29c-38.5 77-38.5 168.7 0 245.7l90.2-70.4z" fill="currentColor" />
            <path d="M272 107.7c39.9 0 75.6 13.7 103.7 40.8l77.8-77.8C407.1 24.2 345.4 0 272 0 166.9 0 74.2 60.9 29 150.3l90.2 70.4C140.8 155.6 201 107.7 272 107.7z" fill="currentColor" />
          </svg>

          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link className="underline underline-offset-4" to='/auth/registration'>Sign up</Link>
      </div>
    </form>
  )
}