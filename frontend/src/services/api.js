import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected calls, clear stale auth data if needed
      // but avoid redirect loops on login page
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authService = {
  login: (usernameOrEmail, password) => api.post('/auth/login', { usernameOrEmail, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Users API
export const userService = {
  getAllUsers: () => api.get('/users'),
  getProfile: (username) => api.get(`/users/profile/${username}`),
  getProfileById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  toggleFollow: (id) => api.post(`/users/${id}/follow`),
  getFollowers: (id) => api.get(`/users/${id}/followers`),
  getFollowing: (id) => api.get(`/users/${id}/following`),
  getUsersBySkill: (skill) => api.get(`/users/skill/${encodeURIComponent(skill)}`),
};

// Posts API
export const postService = {
  getAllPosts: () => api.get('/posts'),
  getFeed: () => api.get('/posts/feed'),
  getTrending: () => api.get('/posts/trending'),
  getPostsByTag: (tag) => api.get(`/posts/tag/${encodeURIComponent(tag)}`),
  getUserPosts: (username) => api.get(`/posts/user/${username}`),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, content) => api.post(`/posts/${id}/comments`, { content }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  deleteComment: (commentId) => api.delete(`/posts/comments/${commentId}`),
};

// Projects API
export const projectService = {
  getAllProjects: (status, tech) => {
    const params = {};
    if (status) params.status = status;
    if (tech) params.tech = tech;
    return api.get('/projects', { params });
  },
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  applyToProject: (id, message) => api.post(`/projects/${id}/apply`, { message }),
  getProjectApplications: (id) => api.get(`/projects/${id}/applications`),
  respondToApplication: (appId, status) => api.post(`/projects/applications/${appId}/respond`, { status }),
  getMyApplications: () => api.get('/projects/my-applications'),
  getUserProjects: (username) => api.get(`/projects/user/${username}`),
  getUserJoinedProjects: (username) => api.get(`/projects/user/${username}/joined`),
};

// Messages API
export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getDirectConversation: (userId) => api.get(`/messages/user/${userId}`),
  getProjectConversation: (projectId) => api.get(`/messages/project/${projectId}`),
  sendMessage: (data) => api.post('/messages', data),
};

// Notifications API
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

// Recommendations & Search API
export const discoveryService = {
  getRecommendations: () => api.get('/recommendations'),
  search: (query) => api.get('/search', { params: { q: query } }),
};

export default api;
