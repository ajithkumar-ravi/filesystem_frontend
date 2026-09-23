export const FILE_TYPES = [
  { value: 'text', label: 'Text', extension: '.txt' },
  { value: 'docx', label: 'DOCX', extension: '.docx' },
  { value: 'json', label: 'JSON', extension: '.json' },
  { value: 'pdf', label: 'PDF', extension: '.pdf' }
];

export function typeLabel(type) {
  if (type === 'folder') return 'Folder';
  const match = FILE_TYPES.find((t) => t.value === type);
  return match ? match.label : type;
}

export function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
