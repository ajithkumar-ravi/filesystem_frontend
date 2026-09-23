import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import FileList from '../components/FileList.jsx';
import ContextMenu from '../components/ContextMenu.jsx';
import CreateFolderModal from '../components/CreateFolderModal.jsx';
import CreateFileModal from '../components/CreateFileModal.jsx';
import RenameModal from '../components/RenameModal.jsx';
import MoveModal from '../components/MoveModal.jsx';
import DeleteModal from '../components/DeleteModal.jsx';
import FilePreviewModal from '../components/FilePreviewModal.jsx';
import { useFileSystem } from '../context/FileSystemContext.jsx';

// Parses the "/files/1/2/3" style path into an array of numeric ids.
function parseIds(pathname) {
  return pathname
    .replace(/^\/files\/?/, '')
    .split('/')
    .filter(Boolean)
    .map(Number);
}

export default function FileExplorer() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    fetchItems,
    fetchItem,
    createFolder,
    createFile,
    renameItem,
    moveItem,
    deleteItem
  } = useFileSystem();

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [crumbs, setCrumbs] = useState([{ id: null, name: 'Home' }]);
  const [previewFile, setPreviewFile] = useState(null);

  const [contextMenu, setContextMenu] = useState(null); // { x, y, item }
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const ids = parseIds(location.pathname);

  // Resolves the current URL into a folder listing (and preview, if a file id is last).
  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (ids.length === 0) {
        if (cancelled) return;
        setCurrentFolderId(null);
        setPreviewFile(null);
        setCrumbs([{ id: null, name: 'Home' }]);
        fetchItems(null);
        return;
      }

      const lastId = ids[ids.length - 1];
      try {
        const item = await fetchItem(lastId);
        if (cancelled) return;

        const chain = [{ id: null, name: 'Home' }, ...(item.breadcrumb || [])];

        if (item.type === 'folder') {
          setCurrentFolderId(item.id);
          setPreviewFile(null);
          setCrumbs(chain);
          fetchItems(item.id);
        } else {
          setPreviewFile(item);
          setCurrentFolderId(item.parent_id);
          setCrumbs(chain);
          fetchItems(item.parent_id);
        }
      } catch {
        if (!cancelled) navigate('/files');
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const pathPrefix = ids.length === 0 ? '' : `/${ids.join('/')}`;

  const openFolder = useCallback((folder) => {
    navigate(`/files${pathPrefix}/${folder.id}`);
  }, [navigate, pathPrefix]);

  const openFile = useCallback((file) => {
    navigate(`/files${pathPrefix}/${file.id}`);
  }, [navigate, pathPrefix]);

  const closePreview = useCallback(() => {
    const parentIds = ids.slice(0, -1);
    const parentPath = parentIds.length === 0 ? '' : `/${parentIds.join('/')}`;
    navigate(`/files${parentPath}`);
  }, [navigate, ids]);

  const navigateBreadcrumb = useCallback((id) => {
    if (id === null) {
      navigate('/files');
      return;
    }
    const index = ids.indexOf(id);
    if (index === -1) return;
    const newIds = ids.slice(0, index + 1);
    navigate(`/files/${newIds.join('/')}`);
  }, [ids, navigate]);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-900">File Explorer</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onNewFolder={() => setShowCreateFolder(true)}
          onNewFile={() => setShowCreateFile(true)}
        />

        <main className="flex-1 overflow-y-auto p-5">
          <Breadcrumb crumbs={crumbs} onNavigate={navigateBreadcrumb} />

          <FileList
            items={items}
            loading={loading}
            error={error}
            onOpenFolder={openFolder}
            onOpenFile={openFile}
            onContextMenu={handleContextMenu}
          />
        </main>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onRename={() => {
            setRenameTarget(contextMenu.item);
            closeContextMenu();
          }}
          onMove={() => {
            setMoveTarget(contextMenu.item);
            closeContextMenu();
          }}
          onDelete={() => {
            setDeleteTarget(contextMenu.item);
            closeContextMenu();
          }}
        />
      )}

      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreate={(name) => createFolder(name, currentFolderId)}
        />
      )}

      {showCreateFile && (
        <CreateFileModal
          onClose={() => setShowCreateFile(false)}
          onCreate={(name, type, content) => createFile(name, type, currentFolderId, content)}
        />
      )}

      {renameTarget && (
        <RenameModal
          item={renameTarget}
          onClose={() => setRenameTarget(null)}
          onSave={(payload) => renameItem(renameTarget.id, payload, currentFolderId)}
        />
      )}

      {moveTarget && (
        <MoveModal
          item={moveTarget}
          onClose={() => setMoveTarget(null)}
          onMove={(destinationId) => moveItem(moveTarget.id, destinationId, currentFolderId)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteItem(deleteTarget.id, currentFolderId)}
        />
      )}

      {previewFile && <FilePreviewModal file={previewFile} onClose={closePreview} />}
    </div>
  );
}
