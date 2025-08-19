import { Navigate, useLocation } from "react-router-dom"

function CheckAuth({ isAuthenticated, user, children }) {

    const location = useLocation()

    if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/registration'))) {
        return <Navigate to='/auth/login'></Navigate>
    }

    if(isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/registration'))){
        if(user?.role === 'user'){
            return <Navigate to='/myuser'></Navigate>
        }
        
    }

    return<>{children}</>

}

export default CheckAuth

// gestione accessi min 1.15