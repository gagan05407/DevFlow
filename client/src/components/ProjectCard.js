import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Chip,
  Tooltip,
  AvatarGroup,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  GitHub as GitHubIcon,
  PersonAdd as PersonAddIcon,
  Star as StarIcon,
  BugReport as BugIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { cardHoverVariants } from '../animations/variants';
import API from '../services/api';
import toast from 'react-hot-toast';

const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const { id, title, description, githubUrl, deadline, totalTasks = 0, completedTasks = 0, progress = 0, members = [] } = project;

  // Invite modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  // GitHub repo live metadata
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    if (!githubUrl) return;
    const fetchGithubData = async () => {
      try {
        // Extract owner/repo from URL like https://github.com/owner/repo
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          const owner = match[1];
          const repo = match[2].replace(/\.git$/, '');
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (res.ok) {
            const data = await res.json();
            setGithubData({
              stars: data.stargazers_count,
              issues: data.open_issues_count,
              language: data.language,
              repoName: `${owner}/${repo}`,
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch GitHub data:', err);
      }
    };
    fetchGithubData();
  }, [githubUrl]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await API.post(`/projects/${id}/invite`, { email: inviteEmail });
      toast.success(res.data.message);
      setInviteEmail('');
      setInviteOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No deadline';

  return (
    <motion.div variants={cardHoverVariants} initial="rest" whileHover="hover">
      <Card
        className="glass-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.5)',
            boxShadow: '0 12px 30px rgba(99, 102, 241, 0.25)',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Typography variant="h4" sx={{ color: '#F9FAFB', fontWeight: 800, letterSpacing: '-0.3px' }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Invite Teammate">
                <IconButton size="small" onClick={() => setInviteOpen(true)} sx={{ color: '#818CF8', '&:hover': { color: '#6366F1', bgcolor: 'rgba(99, 102, 241, 0.15)' } }}>
                  <PersonAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Project">
                <IconButton size="small" onClick={() => onEdit(project)} sx={{ color: '#9CA3AF', '&:hover': { color: '#6366F1', bgcolor: 'rgba(99, 102, 241, 0.1)' } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton size="small" onClick={() => onDelete(project.id)} sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#9CA3AF',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 40,
              lineHeight: 1.6
            }}
          >
            {description || 'No description provided.'}
          </Typography>

          {/* Live GitHub Stats Badge */}
          {githubUrl && (
            <Box
              sx={{
                mb: 2,
                p: 1.2,
                borderRadius: 2,
                bgcolor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GitHubIcon sx={{ fontSize: 18, color: '#F8FAFC' }} />
                <Typography
                  component="a"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="caption"
                  sx={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {githubData?.repoName || 'GitHub Repository'}
                </Typography>
              </Box>

              {githubData && (
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  {githubData.language && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <CodeIcon sx={{ fontSize: 13, color: '#A855F7' }} />
                      <Typography variant="caption" sx={{ color: '#CBD5E1', fontSize: 11, fontWeight: 700 }}>
                        {githubData.language}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <StarIcon sx={{ fontSize: 13, color: '#EAB308' }} />
                    <Typography variant="caption" sx={{ color: '#CBD5E1', fontSize: 11, fontWeight: 700 }}>
                      {githubData.stars}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <BugIcon sx={{ fontSize: 13, color: '#EF4444' }} />
                    <Typography variant="caption" sx={{ color: '#CBD5E1', fontSize: 11, fontWeight: 700 }}>
                      {githubData.issues}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Members Avatars */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700 }}>
              TEAM MEMBERS
            </Typography>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 11 } }}>
              {members.map((m) => (
                <Tooltip key={m.id} title={`${m.user.name} (${m.user.email})`}>
                  <Avatar src={m.user.avatarUrl || undefined}>
                    {m.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ color: '#818CF8', fontWeight: 800 }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #6366F1 0%, #06B6D4 100%)',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#9CA3AF' }}>
              <EventIcon fontSize="small" sx={{ fontSize: 16, color: '#6366F1' }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{formattedDeadline}</Typography>
            </Box>
            <Chip
              label={`${completedTasks} / ${totalTasks} Tasks`}
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818CF8',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1E293B',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#F8FAFC' }}>
          Invite Teammate to "{title}"
        </DialogTitle>
        <form onSubmit={handleSendInvite}>
          <DialogContent>
            <TextField
              label="Teammate Email Address"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              fullWidth
              placeholder="developer@example.com"
              helperText="If an account exists with this email, they will receive an invitation to join this project."
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setInviteOpen(false)} sx={{ color: '#9CA3AF' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={inviting} sx={{ bgcolor: '#6366F1', fontWeight: 700 }}>
              {inviting ? 'Sending Invite...' : 'Send Invitation'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};

export default ProjectCard;
