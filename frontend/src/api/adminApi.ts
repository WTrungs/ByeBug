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

export interface AdminProblemTag {
  tagId: number;
  tagName: string;
}

export interface AdminProblem {
  problemId: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isPublic: boolean;
  createdAt?: string | null;
  createdBy?: string | null;
  tags: AdminProblemTag[];
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
}

export interface AdminProblemPage {
  content: AdminProblem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminProblemExamplePayload {
  input: string;
  output: string;
  explanation?: string | null;
  displayOrder: number;
}

export interface AdminProblemPayload {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimitMs: number;
  memoryLimitKb: number;
  tags: string[];
  description: string;
  constraints: string;
  examples: AdminProblemExamplePayload[];
  isPublic: boolean;
}

export interface AdminProblemDetail extends Omit<AdminProblemPayload, 'tags'> {
  problemId: number;
  tags: Array<string | AdminProblemTag>;
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

export const getAdminProblems = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  difficulty?: string;
  visibility?: string;
  sort?: string;
}): Promise<AdminProblemPage> => {
  const response = await api.get('/admin/problems', { params });
  return response.data;
};

export const getLatestAdminProblems = async (limit = 3): Promise<AdminProblem[]> => {
  const response = await api.get('/admin/problems/latest', { params: { limit } });
  return response.data;
};

export const getPopularAdminProblems = async (limit = 3): Promise<AdminProblem[]> => {
  const response = await api.get('/admin/problems/popular', { params: { limit } });
  return response.data;
};

export const setAdminProblemVisibility = async (
  problemId: number,
  isPublic: boolean,
): Promise<AdminProblem> => {
  const response = await api.patch(`/admin/problems/${problemId}/visibility`, { isPublic });
  return response.data;
};

export const getAdminProblemDetail = async (problemId: number): Promise<AdminProblemDetail> => {
  const response = await api.get(`/admin/problems/${problemId}`);
  return response.data;
};

export const createAdminProblem = async (payload: AdminProblemPayload): Promise<AdminProblemDetail> => {
  const response = await api.post('/admin/problems', payload);
  return response.data;
};

export const updateAdminProblem = async (
  problemId: number,
  payload: AdminProblemPayload,
): Promise<AdminProblemDetail> => {
  const response = await api.put(`/admin/problems/${problemId}`, payload);
  return response.data;
};

export const uploadProblemTests = async (
  problemId: number,
  file: File,
): Promise<{ message: string; objectKey: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/admin/problems/${problemId}/tests`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
