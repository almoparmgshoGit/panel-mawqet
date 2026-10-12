const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Donations
  getDonations: () => fetch(`${API_BASE}/donations`, { cache: 'no-store' }).then(handleResponse),
  createDonation: (data: any) =>
    fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateDonation: (id: string, data: any) =>
    fetch(`${API_BASE}/donations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteDonation: (id: string) =>
    fetch(`${API_BASE}/donations/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Adhkar
  getAdhkarCategories: () => fetch(`${API_BASE}/adhkar/categories`, { cache: 'no-store' }).then(handleResponse),
  createAdhkarCategory: (data: any) =>
    fetch(`${API_BASE}/adhkar/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateAdhkarCategory: (id: string, data: any) =>
    fetch(`${API_BASE}/adhkar/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteAdhkarCategory: (id: string) =>
    fetch(`${API_BASE}/adhkar/categories/${id}`, { method: 'DELETE' }).then(handleResponse),

  createAdhkarItem: (data: any) =>
    fetch(`${API_BASE}/adhkar/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateAdhkarItem: (id: string, data: any) =>
    fetch(`${API_BASE}/adhkar/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteAdhkarItem: (id: string) =>
    fetch(`${API_BASE}/adhkar/items/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Community Posts
  getPosts: () => fetch(`${API_BASE}/posts`, { cache: 'no-store' }).then(handleResponse),
  createPost: (data: any) =>
    fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updatePost: (id: string, data: any) =>
    fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deletePost: (id: string) =>
    fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Janazah
  getJanazahs: () => fetch(`${API_BASE}/janazah`, { cache: 'no-store' }).then(handleResponse),
  createJanazah: (data: any) =>
    fetch(`${API_BASE}/janazah`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateJanazah: (id: string, data: any) =>
    fetch(`${API_BASE}/janazah/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteJanazah: (id: string) =>
    fetch(`${API_BASE}/janazah/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Collections
  getCollections: () => fetch(`${API_BASE}/collections`, { cache: 'no-store' }).then(handleResponse),
  createCollection: (data: any) =>
    fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateCollection: (id: string, data: any) =>
    fetch(`${API_BASE}/collections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteCollection: (id: string) =>
    fetch(`${API_BASE}/collections/${id}`, { method: 'DELETE' }).then(handleResponse),

  createCollectionItem: (data: any) =>
    fetch(`${API_BASE}/collections/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateCollectionItem: (id: string, data: any) =>
    fetch(`${API_BASE}/collections/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteCollectionItem: (id: string) =>
    fetch(`${API_BASE}/collections/items/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Feedback / Reports
  getFeedback: () => fetch(`${API_BASE}/feedback`, { cache: 'no-store' }).then(handleResponse),
  createFeedback: (data: any) =>
    fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateFeedback: (id: string, data: any) =>
    fetch(`${API_BASE}/feedback/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteFeedback: (id: string) =>
    fetch(`${API_BASE}/feedback/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Feature Flags
  getFeatureFlags: () => fetch(`${API_BASE}/settings/flags`, { cache: 'no-store' }).then(handleResponse),
  updateFeatureFlag: (key: string, enabled: boolean) =>
    fetch(`${API_BASE}/settings/flags/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).then(handleResponse),
};
