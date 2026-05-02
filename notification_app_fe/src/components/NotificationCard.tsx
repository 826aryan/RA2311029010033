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

const getTypeStyles = (type?: string) => {
  const t = (type || '').toLowerCase();
  if (t === 'placement') return { bgcolor: '#3b82f6', color: '#ffffff', border: 'none' }; // Vibrant Blue
  if (t === 'result') return { bgcolor: '#10b981', color: '#ffffff', border: 'none' };   // Vibrant Green
  if (t === 'event') return { bgcolor: '#f59e0b', color: '#ffffff', border: 'none' };    // Vibrant Orange
  return { bgcolor: '#64748b', color: '#ffffff', border: 'none' };
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
        bgcolor: !isRead ? '#f8fafc' : '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        position: 'relative',
        '&:hover': {
          borderColor: onClick ? '#cbd5e1' : '#e2e8f0',
          bgcolor: !isRead ? '#f1f5f9' : '#f8fafc',
        }
      }}
    >
      {!isRead && (
        <Box sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 16, width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />
      )}
      <CardContent sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        py: '16px !important', 
        pl: !isRead ? 4 : 2,
        flexWrap: { xs: 'wrap', md: 'nowrap' }
      }}>
        {/* Left Side: Tags */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: '100%', md: '140px' } }}>
          {rank !== undefined && (
            <Chip label={`#${rank}`} size="small" sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 600 }} />
          )}
          <Chip 
            label={t.toUpperCase()} 
            size="small" 
            sx={{ ...getTypeStyles(t), fontWeight: 600, fontSize: '0.7rem', height: 24 }} 
          />
        </Box>

        {/* Center: Message */}
        <Typography 
          variant="body1" 
          noWrap
          sx={{ 
            flexGrow: 1, 
            fontWeight: !isRead ? 500 : 400, 
            color: !isRead ? '#0f172a' : '#475569',
            lineHeight: 1.5,
            width: { xs: '100%', md: 'auto' }
          }}
        >
          {notification.Message}
        </Typography>

        {/* Right Side: Meta */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: { xs: '100%', md: '180px' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          {notification._score !== undefined && (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, minWidth: '80px' }}>
              Score: {notification._score.toFixed(2)}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, minWidth: '80px', textAlign: 'right' }}>
            {timeAgo(timestampStr)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
