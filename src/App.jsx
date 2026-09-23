import { Routes, Route, Navigate } from 'react-router-dom';
import FileExplorer from './pages/FileExplorer.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/files" replace />} />
      <Route path="/files/*" element={<FileExplorer />} />
    </Routes>
  );
}
