import React from 'react';
import ReactDOM from 'react-dom/client';

// Styles inline pour éviter les problèmes CSS
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    maxWidth: '600px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '2rem'
  },
  success: {
    fontSize: '1rem',
    color: '#059669',
    backgroundColor: '#d1fae5',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  },
  info: {
    fontSize: '0.875rem',
    color: '#4b5563'
  }
};

function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mode DZ</h1>
        <p style={styles.subtitle}>Marketplace de Mode Algérienne</p>
        
        <div style={styles.success}>
          ✅ Déploiement réussi sur Cloudflare Pages !
        </div>
        
        <p style={styles.info}>
          L'application React est maintenant fonctionnelle.<br/>
          Prochaine étape : intégration progressive des fonctionnalités.
        </p>
        
        <p style={styles.info}>
          <strong>Stack :</strong> React 18 + TypeScript + Tailwind CSS
        </p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
