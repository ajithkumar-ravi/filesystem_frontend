import { useState } from 'react';
import ModalShell from './ModalShell.jsx';

export default function DeleteModal({ item, onClose, onConfirm }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Delete"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-700">
        Are you sure you want to delete <span className="font-medium">{item.name}</span>?
      </p>
      {item.type === 'folder' && (
        <p className="text-xs text-gray-500 mt-2">
          This will also delete everything inside this folder.
        </p>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </ModalShell>
  );
}
