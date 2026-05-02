import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Box, Skeleton, Snackbar, Alert } from '@mui/material';
import { fetchPriorityNotifications, NotificationItem } from '../api/notifications';
import { NotificationCard } from '../components/NotificationCard';
import { log } from '../utils/logger';

interface Props {
  readIds: string[];
  markAsRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
}

export const PriorityInbox: React.FC<Props> = ({ readIds, markAsRead, setUnreadCount }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [nLimit, setNLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');

  const loadPriority = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPriorityNotifications(nLimit);
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load priority notifications");
    } finally {
      setLoading(false);
    }
  }, [nLimit]);

  useEffect(() => {
    log("info", "page", `PriorityInbox page mounted (fetching top ${nLimit})`);
    loadPriority();
  }, [loadPriority, nLimit]);

  const handleLimitChange = (event: any) => {
    setNLimit(event.target.value);
    log("info", "page", `User changed priority limit to ${event.target.value}`);
  };

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value);
    log("info", "page", `User changed priority type filter to ${event.target.value}`);
  };

  const filteredNotifications = useMemo(() => {
    if (typeFilter === 'All') return notifications;
    return notifications.filter(n => {
      const t = n.Type || '';
      return t.toLowerCase() === typeFilter.toLowerCase();
    });
  }, [notifications, typeFilter]);

  useEffect(() => {
    const unread = filteredNotifications.filter((n, idx) => {
      const id = n.ID || String(idx);
      return !readIds.includes(id);
    }).length;
    setUnreadCount(unread);
  }, [filteredNotifications, readIds, setUnreadCount]);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Priority Inbox</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={typeFilter} label="Type" onChange={handleTypeChange}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Top N</InputLabel>
            <Select value={nLimit} label="Top N" onChange={handleLimitChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
        ))
      ) : filteredNotifications.length === 0 ? (
        <Typography color="text.secondary">No high priority notifications found.</Typography>
      ) : (
        filteredNotifications.map((notif, idx) => {
          const id = notif.ID || String(idx);
          const isRead = readIds.includes(id);
          return (
            <NotificationCard 
              key={id}
              notification={notif} 
              isRead={isRead} 
              rank={idx + 1}
              onClick={() => {
                if (!isRead) {
                  markAsRead(id);
                  log("info", "component", `User marked priority notification ${id} as read`);
                }
              }}
            />
          );
        })
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Container>
  );
};
