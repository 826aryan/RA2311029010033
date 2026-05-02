import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { NotificationItem } from '../api/notifications';

interface Props {
  notification: NotificationItem;
  isRead: boolean;
  onClick?: () => void;
  rank?: number;
}

export function timeAgo(dateParam: string | Date): string {
  if (!dateParam) return '';
  const date = new Date(dateParam);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  return Math.floor(interval) + " minutes ago";
}

const getTypeColor = (type?: string) => {
  const t = (type || '').toLowerCase();
  if (t === 'placement') return 'primary'; // blue
  if (t === 'result') return 'success';   // green
  if (t === 'event') return 'warning';    // orange
  return 'default';
};

export const NotificationCard: React.FC<Props> = ({ notification, isRead, onClick, rank }) => {
  const t = notification.Type || 'unknown';
  const timestampStr = notification.Timestamp || '';
  
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        mb: 2, 
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: !isRead ? '6px solid #1976d2' : '1px solid #e0e0e0',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: onClick ? 3 : 1
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {rank !== undefined && (
              <Chip label={`#${rank}`} size="small" color="secondary" />
            )}
            <Chip 
              label={t.toUpperCase()} 
              size="small" 
              color={getTypeColor(t) as any} 
            />
            {notification._score !== undefined && (
              <Chip label={`Score: ${notification._score.toFixed(2)}`} size="small" variant="outlined" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {timeAgo(timestampStr)}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ fontWeight: !isRead ? 'bold' : 'normal', color: !isRead ? 'text.primary' : 'text.secondary' }}
        >
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
};
