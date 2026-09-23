import { useEffect, useRef } from 'react';

export default function ContextMenu({ x, y, onRename, onMove, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="fixed z-50 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 text-sm"
    >
      <button onClick={onRename} className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700">
        Rename
      </button>
      <button onClick={onMove} className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700">
        Move
      </button>
      <button onClick={onDelete} className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">
        Delete
      </button>
    </div>
  );
}
