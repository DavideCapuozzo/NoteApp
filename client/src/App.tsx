import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLogin from './pages/auth/Login'
import AuthRegistration from './pages/auth/Register'
import AuthLayout from './components/auth-component/layout'
import LayoutDashboard from './components/dashboard-component/layout-dashboard'
import NotFound from './pages/not-found'
import CheckAuth from './components/common/check-auth'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice'
import type { AppDispatch } from './store/store'
import PageNote from './pages/note/Note'
import LayoutNote from './components/note-component/layout-note'
//import UnauthPage from './app/page/unauth-page'


function App() {

  /* const isAuthenticated = false;  */
  /* const user = null */
  /* const user = {
    name:'Davide',
    role:'user'
  } */

  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  if (isLoading) return <div>Loading...</div>

  console.log(isLoading, user);

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout></AuthLayout></CheckAuth>}>
          <Route path='login' element={<AuthLogin></AuthLogin>}></Route>
          <Route path='registration' element={<AuthRegistration></AuthRegistration>}></Route>
        </Route>
        <Route path="/myuser" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><LayoutDashboard /></CheckAuth>}></Route>
        <Route path="/note" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><LayoutNote /></CheckAuth>}></Route>
        <Route path='*' element={<NotFound />}></Route>
        {/* <Route path='/unauth-page' element={<UnauthPage />}></Route> */}
      </Routes>

    </div>
  )
}

export default App