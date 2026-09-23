import { useState } from 'react';
import ModalShell from './ModalShell.jsx';
import { FILE_TYPES } from '../utils.js';

export default function CreateFileModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('File name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onCreate(name.trim(), type, content);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Create File"
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
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">File Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="e.g. notes"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">File Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          {FILE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Type or paste file content (optional)"
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </ModalShell>
  );
}
