import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Extracts a friendly message from an Axios error for UI display.
export function getErrorMessage(error) {
  return error?.response?.data?.message || 'Something went wrong. Please try again.';
}

export const fileApi = {
  getChildren: (parentId) =>
    api.get('/files', { params: parentId ? { parentId } : {} }),

  getOne: (id) => api.get(`/files/${id}`),

  create: (payload) => api.post('/files', payload),

  update: (id, payload) => api.put(`/files/${id}`, payload),

  move: (id, parentId) => api.patch(`/files/${id}/move`, { parentId }),

  remove: (id) => api.delete(`/files/${id}`)
};

export default api;
