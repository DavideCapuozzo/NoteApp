import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/auth-slice';
import { toast } from 'sonner';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Errore durante l\'autenticazione Google');
      navigate('/auth');
      return;
    }

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        // Salva il token nel localStorage o cookie
        localStorage.setItem('token', token);
        
        // Aggiorna lo store Redux
        dispatch(setUser({
          isAuthenticated: true,
          user: userData
        }));

        toast.success('Accesso effettuato con successo!');
        navigate('/myuser');
      } catch (error) {
        console.error('Errore nel parsing dei dati utente:', error);
        toast.error('Errore durante l\'autenticazione');
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2FCCC3] mx-auto"></div>
        <p className="mt-4 text-lg">Completamento accesso...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
