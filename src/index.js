import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './AppRouter'; // ✅ On importe seulement le Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />  {/* ✅ On render seulement le Router qui gère tout */}
  </React.StrictMode>
);