import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

function MinimalApp() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Mode DZ - Test Déploiement</h1>
      <p>✅ L'application React fonctionne !</p>
      <p>🚀 Déployé avec succès sur Cloudflare Pages</p>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);
