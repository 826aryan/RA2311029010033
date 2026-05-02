import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { Navbar } from './components/Navbar';
import { AllNotifications } from './pages/AllNotifications';
import { PriorityInbox } from './pages/PriorityInbox';
import { log } from './utils/logger';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    }
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        }
      }
    }
  }
});

function App() {
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('readNotificationIds');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('readNotificationIds', JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    log("info", "component", "App root mounted");
  }, []);

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar unreadCount={unreadCount} />
          <Box component="main" sx={{ flexGrow: 1, pb: 4 }}>
            <Routes>
              <Route 
                path="/" 
                element={<AllNotifications readIds={readIds} markAsRead={markAsRead} setUnreadCount={setUnreadCount} />} 
              />
              <Route 
                path="/priority" 
                element={<PriorityInbox readIds={readIds} markAsRead={markAsRead} setUnreadCount={setUnreadCount} />} 
              />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
