import { createContext, useCallback, useContext, useState } from 'react';
import { fileApi, getErrorMessage } from '../services/fileApi.js';

const FileSystemContext = createContext(null);

const OWNER = 'Ajith';

export function FileSystemProvider({ children }) {
  const [items, setItems] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Loads the direct children of a folder (null/undefined = root).
  const fetchItems = useCallback(async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fileApi.getChildren(folderId ?? null);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Loads a single item plus its breadcrumb chain (folder or file).
  const fetchItem = useCallback(async (id) => {
    setError(null);
    try {
      const res = await fileApi.getOne(id);
      setBreadcrumb(res.data.breadcrumb || []);
      return res.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const createFolder = useCallback(async (name, parentId) => {
    setError(null);
    try {
      await fileApi.create({ name, type: 'folder', parentId: parentId ?? null, owner: OWNER });
      await fetchItems(parentId ?? null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchItems]);

  const createFile = useCallback(async (name, type, parentId, content) => {
    setError(null);
    try {
      await fileApi.create({ name, type, parentId: parentId ?? null, owner: OWNER, content });
      await fetchItems(parentId ?? null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchItems]);

  // Rename (and optionally change type/content) then refresh the parent list.
  const renameItem = useCallback(async (id, payload, parentId) => {
    setError(null);
    try {
      await fileApi.update(id, payload);
      await fetchItems(parentId ?? null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchItems]);

  const updateFile = useCallback(async (id, payload, parentId) => {
    return renameItem(id, payload, parentId);
  }, [renameItem]);

  const moveItem = useCallback(async (id, destinationParentId, currentParentId) => {
    setError(null);
    try {
      await fileApi.move(id, destinationParentId ?? null);
      await fetchItems(currentParentId ?? null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchItems]);

  const deleteItem = useCallback(async (id, parentId) => {
    setError(null);
    try {
      await fileApi.remove(id);
      await fetchItems(parentId ?? null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchItems]);

  const value = {
    items,
    breadcrumb,
    loading,
    error,
    setError,
    fetchItems,
    fetchItem,
    createFolder,
    createFile,
    renameItem,
    updateFile,
    moveItem,
    deleteItem
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const ctx = useContext(FileSystemContext);
  if (!ctx) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return ctx;
}
