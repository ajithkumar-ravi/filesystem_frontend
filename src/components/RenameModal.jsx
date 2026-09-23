import { useState } from 'react';
import ModalShell from './ModalShell.jsx';
import { FILE_TYPES } from '../utils.js';

// Strips the known extension from a file name so the input shows the base name.
function baseName(name, type) {
  const match = FILE_TYPES.find((t) => t.value === type);
  if (match && name.toLowerCase().endsWith(match.extension)) {
    return name.slice(0, name.length - match.extension.length);
  }
  return name;
}

export default function RenameModal({ item, onClose, onSave }) {
  const isFolder = item.type === 'folder';
  const [name, setName] = useState(isFolder ? item.name : baseName(item.name, item.type));
  const [type, setType] = useState(item.type);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSave(isFolder ? { name: name.trim() } : { name: name.trim(), type });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title={isFolder ? 'Rename Folder' : 'Rename File'}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Save
          </button>
        </>
      }
    >
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {isFolder ? 'Name' : 'File Name'}
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      {!isFolder && (
        <div className="mb-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">File Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            {FILE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">Press Enter to save</p>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </ModalShell>
  );
}
