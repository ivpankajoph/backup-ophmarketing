const API_BASE = '/api';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  },

  async post(endpoint: string, data?: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  },

  async put(endpoint: string, data?: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  },

  dashboard: {
    getStats: () => api.get('/dashboard'),
  },

  facebook: {
    syncForms: () => api.post('/facebook/syncForms'),
    getForms: () => api.get('/facebook/forms'),
    syncLeads: () => api.post('/facebook/syncLeads'),
    getLeads: (formId?: string) => api.get(formId ? `/facebook/leads?formId=${formId}` : '/facebook/leads'),
  },

  agents: {
    getAll: () => api.get('/agents'),
    getById: (id: string) => api.get(`/agents/${id}`),
    create: (data: { name: string; model: string; prompt: string; isDefault?: boolean }) => 
      api.post('/agents', data),
    update: (id: string, data: { name?: string; model?: string; prompt?: string; isDefault?: boolean }) => 
      api.put(`/agents/${id}`, data),
    delete: (id: string) => api.delete(`/agents/${id}`),
    test: (id: string, message: string) => api.post(`/agents/${id}/test`, { message }),
    chat: (agentId: string | null, message: string) => api.post('/agents/chat', { agentId, message }),
  },

  mapping: {
    getAll: () => api.get('/map-agent'),
    create: (data: { formId?: string; senderId?: string; agentId: string }) => 
      api.post('/map-agent', data),
    delete: (id: string) => api.delete(`/map-agent/${id}`),
  },

  whatsapp: {
    getMessages: () => api.get('/messages'),
    getConversations: () => api.get('/conversations'),
    sendMessage: (to: string, message: string) => api.post('/messages/send', { to, message }),
  },
};

export default api;
