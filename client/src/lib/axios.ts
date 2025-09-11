import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Variabile per tenere il reference al dispatch, verrà inizializzata dal main.tsx
let storeDispatch: any = null;

export const initializeAxiosInterceptors = (dispatch: any) => {
  storeDispatch = dispatch;
};

// Flag per evitare loop infiniti durante il refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor per le risposte
axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se l'errore è 401 e contiene TOKEN_EXPIRED
    if (error.response?.status === 401 && 
        error.response?.data && 
        typeof error.response.data === 'object' && 
        'code' in error.response.data && 
        error.response.data.code === 'TOKEN_EXPIRED' &&
        !originalRequest._retry) {

      if (isRefreshing) {
        // Se stiamo già refreshando, accoda la richiesta
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Riprova la richiesta originale
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Verifica che il dispatch sia disponibile
        if (!storeDispatch) {
          processQueue(new Error('Store dispatch not initialized'), null);
          return Promise.reject(new Error('Store dispatch not initialized'));
        }

        // Importa refreshToken dinamicamente per evitare circular imports
        const { refreshToken } = await import('../store/auth-slice');
        
        // Tenta di fare il refresh del token
        const result = await storeDispatch(refreshToken());
        
        if (refreshToken.fulfilled.match(result)) {
          processQueue(null, 'refreshed');
          // Riprova la richiesta originale
          return axios(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
