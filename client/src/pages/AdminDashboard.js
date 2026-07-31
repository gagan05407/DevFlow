import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  FolderSpecial as ProjectsIcon,
  AssignmentTurnedIn as TasksIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwitchRoleIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import API from '../services/api';
import StatCard from '../components/StatCard';
import { containerVariants, itemVariants } from '../animations/variants';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Selected user for role change/delete dialog
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users);
    } catch (err) {
      console.error('Fetch Admin Data Error:', err);
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await API.put(`/admin/users/${user.id}/role`, { role: newRole });
      setActionSuccess(`User ${user.name}'s role updated to ${newRole}`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Toggle Role Error:', err);
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await API.delete(`/admin/users/${selectedUser.id}`);
      setActionSuccess(`User ${selectedUser.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Delete User Error:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 48,
            height: 48,
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}
        >
          <ShieldIcon sx={{ fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Admin Control Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system users, monitor platform metrics, and control administrator access.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionSuccess('')}>
          {actionSuccess}
        </Alert>
      )}

      {/* Admin Stats Grid */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Platform Users"
              value={stats.totalUsers}
              icon={<PeopleIcon />}
              color="#6366F1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={<ProjectsIcon />}
              color="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon={<TasksIcon />}
              color="#10B981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Administrators"
              value={stats.adminCount}
              icon={<AdminIcon />}
              color="#EC4899"
            />
          </Grid>
        </Grid>
      )}

      {/* User Management Table */}
      <Paper
        component={motion.div}
        variants={itemVariants}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Registered User Directory ({users.length})
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Projects</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Joined Date</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: u.role === 'ADMIN' ? 'primary.main' : 'secondary.main',
                          width: 34,
                          height: 34,
                          fontSize: 14,
                          fontWeight: 600
                        }}
                      >
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {u.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={u.role === 'ADMIN' ? 'primary' : 'default'}
                      icon={u.role === 'ADMIN' ? <AdminIcon sx={{ fontSize: '16px !important' }} /> : undefined}
                      sx={{ fontWeight: 600, px: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {u._count?.projects || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<SwitchRoleIcon />}
                      onClick={() => handleToggleRole(u)}
                      sx={{ mr: 1, textTransform: 'none' }}
                    >
                      Make {u.role === 'ADMIN' ? 'User' : 'Admin'}
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedUser(u);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong> ({selectedUser?.email})? All of their projects and tasks will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete User Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
