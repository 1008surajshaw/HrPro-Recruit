'use client'

import { useState, useEffect } from 'react';
import { getNotification } from '@/actions/notification.action';

interface Notification {
  type: string;
  content: string;
  createdAt: Date;
} 

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await getNotification(userId);
        
        if (response.status) {
          setNotifications(response.additional);
          setError(null);
        } else {
          setError('Failed to fetch notifications');
        }
      } catch (err) {
        if (isMounted) {
          setError('An error occurred while fetching notifications');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [userId]);

  return { notifications, isLoading, error };
}

