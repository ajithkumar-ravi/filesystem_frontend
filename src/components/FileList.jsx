import FileRow from './FileRow.jsx';

export default function FileList({ items, loading, error, onOpenFolder, onOpenFile, onContextMenu }) {
  if (loading) {
    return <div className="text-sm text-gray-500 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600 py-8 text-center">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="text-sm text-gray-500 py-8 text-center">This folder is empty.</div>;
  }

  const handleDoubleClick = (item) => {
    if (item.type === 'folder') {
      onOpenFolder(item);
    } else {
      onOpenFile(item);
    }
  };

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-200">
          <th className="py-2 px-3 font-medium">Name</th>
          <th className="py-2 px-3 font-medium">Type</th>
          <th className="py-2 px-3 font-medium">Owner</th>
          <th className="py-2 px-3 font-medium">Created At</th>
          <th className="py-2 px-3 font-medium">Updated At</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <FileRow
            key={item.id}
            item={item}
            onDoubleClick={handleDoubleClick}
            onContextMenu={onContextMenu}
          />
        ))}
      </tbody>
    </table>
  );
}
