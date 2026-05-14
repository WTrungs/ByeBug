import api from './axios';

export interface AdminUser {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  gender?: string | null;
  role: string;
  totalScore: number;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt?: string | null;
  lastLoginAt?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

export interface AdminUserPage {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminActivity {
  id: number;
  time?: string | null;
  user: string;
  action: string;
  target: string;
  status: string;
}

export interface AdminOverview {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  deletedUsers: number;
  totalProblems: number;
  publicProblems: number;
  privateProblems: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  failedSubmissions: number;
  acceptanceRate: number;
  recentActivities: AdminActivity[];
}

export const getAdminUsers = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
}): Promise<AdminUserPage> => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getTopAdminUsers = async (limit = 3): Promise<AdminUser[]> => {
  const response = await api.get('/admin/users/top', { params: { limit } });
  return response.data;
};

export const setAdminUserActive = async (userId: number, active: boolean): Promise<AdminUser> => {
  const response = await api.patch(`/admin/users/${userId}/active`, { active });
  return response.data;
};

export const deleteAdminUser = async (userId: number): Promise<AdminUser> => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const restoreAdminUser = async (userId: number): Promise<AdminUser> => {
  const response = await api.post(`/admin/users/${userId}/restore`);
  return response.data;
};

export const getAdminOverview = async (): Promise<AdminOverview> => {
  const response = await api.get('/admin/overview');
  return response.data;
};

// ── Notifications ──────────────────────────────────────────────────────────

export interface CreateBroadcastPayload {
  title: string;
  content: string;
  audienceType: 'ALL' | 'USER' | 'ADMIN';
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
}

export interface BroadcastItem {
  broadcastId: number;
  title: string;
  content: string;
  audienceType: string;
  priority: string;
  createdByAdminUsername: string;
  scheduledAt?: string | null;
  createdAt: string;
}

export interface BroadcastPage {
  content: BroadcastItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const createBroadcast = async (payload: CreateBroadcastPayload): Promise<BroadcastItem> => {
  const response = await api.post('/admin/notifications', payload);
  return response.data;
};

export const getAdminBroadcasts = async (params?: { page?: number; size?: number }): Promise<BroadcastPage> => {
  const response = await api.get('/admin/notifications', { params });
  return response.data;
};
