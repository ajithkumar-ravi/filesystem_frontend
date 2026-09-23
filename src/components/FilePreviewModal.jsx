import { X } from 'lucide-react';
import { typeLabel } from '../utils.js';

export default function FilePreviewModal({ file, onClose }) {
  const hasContent = file.content && file.content.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">{file.name}</h2>
            <p className="text-xs text-gray-400">{typeLabel(file.type)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-6 min-h-[100px] max-h-80 overflow-y-auto">
          {hasContent ? (
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{file.content}</pre>
          ) : (
            <p className="text-sm text-gray-400 text-center">This file is empty.</p>
          )}
        </div>

        <div className="flex justify-end px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
