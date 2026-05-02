import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, Box, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface Props {
  unreadCount: number;
}

export const Navbar: React.FC<Props> = ({ unreadCount }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky" sx={{ mb: 4, bgcolor: '#ffffff', color: '#0f172a', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{ flexGrow: 1, fontWeight: '700', letterSpacing: '-0.02em' }}>
          NotifierApp
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 3 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            size={isMobile ? "small" : "medium"}
            sx={{ borderBottom: location.pathname === '/' ? '2px solid #0f172a' : 'none', borderRadius: 0, pb: 0.5, color: location.pathname === '/' ? '#0f172a' : '#64748b', '&:hover': { bgcolor: 'transparent', color: '#0f172a' } }}
          >
            {isMobile ? 'All' : 'All Notifications'}
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority"
            size={isMobile ? "small" : "medium"}
            sx={{ borderBottom: location.pathname === '/priority' ? '2px solid #0f172a' : 'none', borderRadius: 0, pb: 0.5, color: location.pathname === '/priority' ? '#0f172a' : '#64748b', '&:hover': { bgcolor: 'transparent', color: '#0f172a' } }}
          >
            {isMobile ? 'Priority' : 'Priority Inbox'}
          </Button>
          <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1, '& .MuiBadge-badge': { right: -3, top: 3 } }}>
            <NotificationsIcon sx={{ color: '#64748b' }} />
          </Badge>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
