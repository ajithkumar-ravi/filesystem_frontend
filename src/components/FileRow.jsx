import { Folder, FileText, FileJson, FileCode } from 'lucide-react';
import { typeLabel, formatDate } from '../utils.js';

function ItemIcon({ type }) {
  if (type === 'folder') return <Folder size={18} className="text-yellow-500" />;
  if (type === 'json') return <FileJson size={18} className="text-amber-600" />;
  if (type === 'docx') return <FileCode size={18} className="text-blue-600" />;
  if (type === 'pdf') return <FileText size={18} className="text-red-600" />;
  return <FileText size={18} className="text-gray-500" />;
}

export default function FileRow({ item, onDoubleClick, onContextMenu }) {
  return (
    <tr
      onDoubleClick={() => onDoubleClick(item)}
      onContextMenu={(e) => onContextMenu(e, item)}
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer select-none"
    >
      <td className="py-2 px-3 flex items-center gap-2 text-gray-800">
        <ItemIcon type={item.type} />
        {item.name}
      </td>
      <td className="py-2 px-3 text-gray-600">{typeLabel(item.type)}</td>
      <td className="py-2 px-3 text-gray-600">{item.owner}</td>
      <td className="py-2 px-3 text-gray-600">{formatDate(item.created_at)}</td>
      <td className="py-2 px-3 text-gray-600">{formatDate(item.updated_at)}</td>
    </tr>
  );
}
