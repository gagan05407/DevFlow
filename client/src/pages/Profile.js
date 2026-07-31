import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { DeleteForever as DeleteIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete account confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put('/users/profile', {
        name,
        avatarUrl: avatarUrl || undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      updateUserProfile(res.data.data.user);
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Profile settings saved successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await API.delete('/auth/delete-account');
      toast.success('Your DevFlow account was deleted.');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
          User Profile & Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#9CA3AF', mt: 0.5 }}>
          Manage your personal developer details, profile avatar, and account credentials.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 680 }}>
        {/* Main Settings Card */}
        <Card sx={{ background: '#111827', border: '1px solid rgba(255, 255, 255, 0.08)', p: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4 }}>
              <Avatar
                src={avatarUrl || user?.avatarUrl || undefined}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#6366F1',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  border: '2px solid rgba(99, 102, 241, 0.5)'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                  {user?.email}
                </Typography>
                {user?.role && (
                  <Typography variant="caption" sx={{ color: '#818CF8', fontWeight: 700, mt: 0.5, display: 'block' }}>
                    ROLE: {user.role}
                  </Typography>
                )}
              </Box>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#818CF8' }}>
                  Personal Details & Avatar
                </Typography>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Profile Picture URL (Optional)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  fullWidth
                  placeholder="https://example.com/my-photo.jpg"
                  helperText="Google profile avatar is synced automatically, or paste a custom image URL."
                />
                <TextField
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  fullWidth
                  helperText="Primary account email address."
                />

                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                <Typography variant="h5" sx={{ fontWeight: 700, color: '#818CF8' }}>
                  Security & Password
                </Typography>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  helperText="Required only if changing password"
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  helperText="Must be at least 6 characters"
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    mt: 1,
                    py: 1.3,
                    fontWeight: 700,
                    bgcolor: '#6366F1',
                    '&:hover': { bgcolor: '#4F46E5' },
                  }}
                >
                  {submitting ? 'Saving Changes...' : 'Save Settings'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card
          sx={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            p: 2,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <SecurityIcon sx={{ color: '#EF4444' }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>
                Danger Zone
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2.5 }}>
              Deleting your account is permanent. All your projects, tasks, and settings will be permanently erased.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteModalOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1E293B',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#EF4444' }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#E2E8F0' }}>
            Are you completely sure you want to delete your account? This action **cannot be undone**.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ color: '#9CA3AF' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={<DeleteIcon />}
            sx={{ fontWeight: 700 }}
          >
            {deleting ? 'Deleting Account...' : 'Yes, Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Profile;
