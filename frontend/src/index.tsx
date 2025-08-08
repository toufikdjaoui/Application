import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import './index.css';
import './i18n';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <App />
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName=""
                  containerStyle={{}}
                  toastOptions={{
                    // Define default options
                    className: '',
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                      duration: 3000,
                    },
                  }}
                />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
