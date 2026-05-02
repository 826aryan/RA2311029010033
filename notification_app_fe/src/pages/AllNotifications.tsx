import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Box, Skeleton, Button, Snackbar, Alert } from '@mui/material';
import { fetchAllNotifications, NotificationItem } from '../api/notifications';
import { NotificationCard } from '../components/NotificationCard';
import { log } from '../utils/logger';

interface Props {
  readIds: string[];
  markAsRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
}

export const AllNotifications: React.FC<Props> = ({ readIds, markAsRead, setUnreadCount }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('All');
  const limit = 10;

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const typeParam = typeFilter === 'All' ? undefined : typeFilter;
      const data = await fetchAllNotifications({ page, limit, notification_type: typeParam });
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    log("info", "page", "AllNotifications page mounted or filters changed");
    loadNotifications();
  }, [loadNotifications]);

  // Compute unread count for current view
  useEffect(() => {
    const unread = notifications.filter((n, idx) => {
      const id = n.ID || String(idx);
      return !readIds.includes(id);
    }).length;
    setUnreadCount(unread);
  }, [notifications, readIds, setUnreadCount]);

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value);
    setPage(1);
    log("info", "page", `User changed type filter to ${event.target.value}`);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = new Date(a.Timestamp || 0).getTime();
    const timeB = new Date(b.Timestamp || 0).getTime();
    return timeB - timeA;
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>All Notifications</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={handleTypeChange}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
        ))
      ) : sortedNotifications.length === 0 ? (
        <Typography color="text.secondary">No notifications found.</Typography>
      ) : (
        sortedNotifications.map((notif, idx) => {
          const id = notif.ID || String(idx);
          const isRead = readIds.includes(id);
          return (
            <NotificationCard 
              key={id}
              notification={notif} 
              isRead={isRead} 
              onClick={() => {
                if (!isRead) {
                  markAsRead(id);
                  log("info", "component", `User marked notification ${id} as read`);
                }
              }}
            />
          );
        })
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 4 }}>
        <Button 
          variant="outlined" 
          disabled={page === 1 || loading}
          onClick={() => {
            setPage(p => p - 1);
            log("info", "page", `User navigated to previous page`);
          }}
        >
          Previous
        </Button>
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>Page {page}</Typography>
        <Button 
          variant="outlined" 
          disabled={notifications.length < limit || loading}
          onClick={() => {
            setPage(p => p + 1);
            log("info", "page", `User navigated to next page`);
          }}
        >
          Next
        </Button>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Container>
  );
};
