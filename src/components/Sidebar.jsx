import { FolderPlus, FilePlus, FolderOpen } from 'lucide-react';

export default function Sidebar({ onNewFolder, onNewFile }) {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold">
        <FolderOpen size={20} />
        <span>File Explorer</span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onNewFolder}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
        >
          <FolderPlus size={16} />
          New Folder
        </button>
        <button
          onClick={onNewFile}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
        >
          <FilePlus size={16} />
          New File
        </button>
      </div>
    </aside>
  );
}
