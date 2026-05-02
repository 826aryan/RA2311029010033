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
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          NotifierApp
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            size={isMobile ? "small" : "medium"}
            sx={{ borderBottom: location.pathname === '/' ? '2px solid white' : 'none', borderRadius: 0 }}
          >
            {isMobile ? 'All' : 'All Notifications'}
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority"
            size={isMobile ? "small" : "medium"}
            sx={{ borderBottom: location.pathname === '/priority' ? '2px solid white' : 'none', borderRadius: 0 }}
          >
            {isMobile ? 'Priority' : 'Priority Inbox'}
          </Button>
          <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }}>
            <NotificationsIcon />
          </Badge>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
