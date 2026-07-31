import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Badge,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Person,
  Code as CodeIcon,
  Notifications as NotificationsIcon,
  Shield as AdminShieldIcon,
  Warning as WarningIcon,
  GroupAdd as GroupAddIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Notifications & Pending Invites
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [tasksRes, invitesRes] = await Promise.all([
        API.get('/tasks', { params: { limit: 50 } }),
        API.get('/projects/invites')
      ]);

      const allTasks = tasksRes.data.data.tasks || [];
      const now = new Date();
      const urgent = allTasks.filter(t => {
        if (t.status === 'COMPLETED' || !t.dueDate) return false;
        const due = new Date(t.dueDate);
        const diffHours = (due - now) / (1000 * 60 * 60);
        return diffHours <= 48;
      });
      setUrgentTasks(urgent);
      setPendingInvites(invitesRes.data.data.invites || []);
    } catch (err) {
      console.error('Fetch Notifications Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRespondInvite = async (inviteId, action) => {
    try {
      const res = await API.patch(`/projects/invites/${inviteId}`, { action });
      toast.success(res.data.message);
      fetchData();
    } catch (err) {
      toast.error('Failed to respond to invitation');
    }
  };

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleProfile = () => {
    handleCloseMenu();
    navigate('/profile');
  };

  const handleAdminClick = () => {
    handleCloseMenu();
    navigate('/admin');
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    toast.success('Logged out cleanly');
    navigate('/login');
  };

  const totalNotifs = urgentTasks.length + pendingInvites.length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#0F172A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <CodeIcon sx={{ color: '#6366F1', fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #818CF8 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          >
            DevFlow
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAdmin && (
            <Chip
              icon={<AdminShieldIcon sx={{ fontSize: '16px !important' }} />}
              label="ADMIN"
              size="small"
              color="primary"
              onClick={() => navigate('/admin')}
              sx={{ cursor: 'pointer', fontWeight: 700, px: 0.5 }}
            />
          )}

          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: '#9CA3AF' }}>
            👋 Hello, <strong style={{ color: '#F9FAFB' }}>{user?.name || 'Developer'}</strong>
          </Typography>

          {/* Notifications Bell */}
          <Tooltip title="Notifications & Project Invites">
            <IconButton
              onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              sx={{ color: '#9CA3AF', '&:hover': { color: '#F9FAFB' } }}
            >
              <Badge badgeContent={totalNotifs} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={() => setNotifAnchorEl(null)}
            PaperProps={{
              sx: {
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 1.5,
                width: 360,
                maxHeight: 460
              }
            }}
          >
            <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
                Notifications
              </Typography>
              <Chip label={totalNotifs} size="small" color="error" sx={{ height: 20, fontSize: 11 }} />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

            {/* Pending Team Invites */}
            {pendingInvites.length > 0 && (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#818CF8', fontWeight: 700, px: 1 }}>
                  TEAM PROJECT INVITATIONS ({pendingInvites.length})
                </Typography>
                {pendingInvites.map((inv) => (
                  <Box
                    key={inv.id}
                    sx={{
                      p: 1.5,
                      mt: 1,
                      borderRadius: 2,
                      bgcolor: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <GroupAddIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
                          {inv.project.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                          Invited by {inv.project.user.name} ({inv.project.user.email})
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={() => handleRespondInvite(inv.id, 'decline')}
                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                      >
                        Decline
                      </Button>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => handleRespondInvite(inv.id, 'accept')}
                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        Accept
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Task Deadline Notifications */}
            {urgentTasks.length > 0 && (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700, px: 1 }}>
                  URGENT DEADLINES ({urgentTasks.length})
                </Typography>
                {urgentTasks.map((t) => (
                  <MenuItem
                    key={t.id}
                    onClick={() => {
                      setNotifAnchorEl(null);
                      navigate('/tasks');
                    }}
                    sx={{ py: 1.5, display: 'flex', gap: 1.5, alignItems: 'flex-start', borderRadius: 1.5, mt: 0.5 }}
                  >
                    <WarningIcon color="warning" sx={{ fontSize: 20, mt: 0.2 }} />
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F9FAFB' }} noWrap>
                        {t.title}
                      </Typography>
                      <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                        Due: {new Date(t.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Box>
            )}

            {totalNotifs === 0 && (
              <Box sx={{ p: 3, textAlign: 'center', color: '#9CA3AF' }}>
                <Typography variant="body2">All caught up! No pending invites or urgent tasks 🎉</Typography>
              </Box>
            )}
          </Menu>

          {/* User Avatar */}
          <Tooltip title="Account Settings">
            <IconButton onClick={handleOpenMenu} size="small">
              <Avatar
                src={user?.avatarUrl || undefined}
                sx={{
                  bgcolor: '#6366F1',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  width: 38,
                  height: 38,
                  border: '2px solid rgba(99, 102, 241, 0.5)'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 1.5,
                minWidth: 180,
              },
            }}
          >
            <MenuItem onClick={handleProfile} sx={{ gap: 1.5 }}>
              <Person fontSize="small" sx={{ color: '#818CF8' }} />
              Profile Settings
            </MenuItem>
            {isAdmin && (
              <MenuItem onClick={handleAdminClick} sx={{ gap: 1.5, color: '#6366F1' }}>
                <AdminShieldIcon fontSize="small" />
                Admin Portal
              </MenuItem>
            )}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: '#EF4444' }}>
              <Logout fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
