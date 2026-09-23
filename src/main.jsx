import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { FileSystemProvider } from './context/FileSystemContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FileSystemProvider>
        <App />
      </FileSystemProvider>
    </BrowserRouter>
  </React.StrictMode>
);
