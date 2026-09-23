import { useState } from 'react';
import ModalShell from './ModalShell.jsx';

export default function CreateFolderModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onCreate(name.trim());
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Create Folder"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Create
          </button>
        </>
      }
    >
      <label className="block text-xs font-medium text-gray-600 mb-1">Folder Name</label>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder="e.g. Documents"
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </ModalShell>
  );
}
