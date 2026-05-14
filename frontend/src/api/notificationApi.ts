import api from './axios';

export interface UserNotification {
  notificationId: number;
  broadcastId: number;
  title: string;
  content: string;
  audienceType: string;
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPage {
  content: UserNotification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const getMyNotifications = async (params?: { page?: number; size?: number }): Promise<NotificationPage> => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markNotificationRead = async (notificationId: number): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`);
};
