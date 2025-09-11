import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/fonts/fonts.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import { Toaster } from 'sonner'
import { initializeAxiosInterceptors } from './lib/axios'

// Inizializza gli interceptors axios con il dispatch dello store
initializeAxiosInterceptors(store.dispatch);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>

  </BrowserRouter>

)


