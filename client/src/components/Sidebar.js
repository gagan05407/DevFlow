import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as ProjectIcon,
  Assignment as TaskIcon,
  Person as ProfileIcon,
  Shield as AdminIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const drawerWidth = 240;

const Sidebar = ({ open, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Projects', icon: <ProjectIcon />, path: '/projects' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    ...(isAdmin ? [{ text: 'Admin Portal', icon: <AdminIcon />, path: '/admin' }] : [])
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', py: 2 }}>
      <List>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 1.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (open && window.innerWidth < 900) onToggleSidebar();
                }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  borderLeft: active ? '4px solid #6366F1' : '4px solid transparent',
                  color: active ? '#818CF8' : '#9CA3AF',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    color: '#F3F4F6',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? '#818CF8' : '#9CA3AF',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500 }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#0F172A',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#0F172A',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            top: '64px',
            height: 'calc(100vh - 64px)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
