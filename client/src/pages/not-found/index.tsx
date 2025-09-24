import { Menu } from "@/components/dashboard-component/menu"
import { Link } from "react-router-dom"


function NotFound() {
    return(
        <>
            <div className="w-full h-screen flex flex-col">
                <Menu />
        
                <div className="flex flex-col items-center justify-center flex-1">
                    <h1 className="text-9xl font-bold">404</h1>
                    <p className="text-2xl">page not found</p>
                    <Link to="/myuser" className="hover:underline">Back to Dashboard</Link>
                </div>
                
            </div>
            
        </>
    )
    
}

export default NotFound