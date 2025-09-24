import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import AuthLogin from './pages/auth/Login';
import LayoutHome from './components/home/layout-home';
import AuthRegistration from './pages/auth/Register';
import GoogleCallback from './pages/auth/GoogleCallback';
import AuthLayout from './components/auth-component/layout';
import LayoutDashboard from './components/dashboard-component/layout-dashboard';
import NotFound from './pages/not-found';
import CheckAuth from './components/common/check-auth';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './store/auth-slice';
import type { AppDispatch, RootState } from './store/store';
import LayoutNote from './components/note-component/layout-note';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Redirect principale a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Home Layout */}
        <Route path="/home" element={<LayoutHome />} />

        {/* Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="registration" element={<AuthRegistration />} />
        </Route>

        {/* Google OAuth Callback */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Dashboard */}
        <Route
          path="/myuser"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <LayoutDashboard />
            </CheckAuth>
          }
        />

        {/* Note: nuova e esistente */}
        <Route
          path="/note"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <LayoutNote />
            </CheckAuth>
          }
        />
        <Route
          path="/note/:id"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <LayoutNote />
            </CheckAuth>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
