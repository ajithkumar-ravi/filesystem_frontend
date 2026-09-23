import { useEffect, useState } from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import ModalShell from './ModalShell.jsx';
import { fileApi, getErrorMessage } from '../services/fileApi.js';

// A small self-contained folder browser used only to pick a move destination.
export default function MoveModal({ item, onClose, onMove }) {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [path, setPath] = useState([{ id: null, name: 'Home' }]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFolder(null, [{ id: null, name: 'Home' }]);
  }, []);

  async function loadFolder(folderId, newPath) {
    setLoading(true);
    setError('');
    try {
      const res = await fileApi.getChildren(folderId);
      setFolders(res.data.filter((f) => f.type === 'folder'));
      setCurrentFolderId(folderId);
      setPath(newPath);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const enterFolder = (folder) => {
    if (item.type === 'folder' && folder.id === item.id) return; // can't enter itself
    loadFolder(folder.id, [...path, { id: folder.id, name: folder.name }]);
  };

  const goToBreadcrumb = (index) => {
    const target = path[index];
    loadFolder(target.id, path.slice(0, index + 1));
  };

  const handleMove = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onMove(currentFolderId);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const alreadyHere = currentFolderId === item.parent_id ||
    (currentFolderId === null && item.parent_id === null);

  return (
    <ModalShell
      title={`Move "${item.name}"`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={submitting || alreadyHere}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Move Here
          </button>
        </>
      }
    >
      <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-3">
        {path.map((p, i) => (
          <span key={p.id ?? 'home'} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            <button onClick={() => goToBreadcrumb(i)} className="hover:underline">
              {p.name}
            </button>
          </span>
        ))}
      </div>

      <div className="border border-gray-200 rounded-md max-h-56 overflow-y-auto">
        {loading ? (
          <div className="text-sm text-gray-500 py-6 text-center">Loading...</div>
        ) : folders.length === 0 ? (
          <div className="text-sm text-gray-500 py-6 text-center">No subfolders here.</div>
        ) : (
          folders.map((folder) => {
            const disabled = item.type === 'folder' && folder.id === item.id;
            return (
              <button
                key={folder.id}
                onClick={() => enterFolder(folder)}
                disabled={disabled}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border-b border-gray-100 last:border-b-0"
              >
                <span className="flex items-center gap-2">
                  <Folder size={16} className="text-yellow-500" />
                  {folder.name}
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            );
          })
        )}
      </div>

      {alreadyHere && (
        <p className="text-xs text-gray-400 mt-2">Item is already in this folder.</p>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </ModalShell>
  );
}
