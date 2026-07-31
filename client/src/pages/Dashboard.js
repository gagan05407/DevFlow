import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  LinearProgress,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Folder as ProjectIcon,
  Assignment as TaskIcon,
  CheckCircle as CompleteIcon,
  HourglassEmpty as PendingIcon,
  Add as AddIcon,
  CheckCircleOutline,
  RadioButtonUnchecked,
  AutoAwesome as SparklesIcon,
  Terminal as TerminalIcon,
  RocketLaunch as RocketIcon
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import API from '../services/api';
import { motion } from 'framer-motion';
import { pageVariants, containerStagger, itemFadeIn } from '../animations/variants';
import { useNavigate } from 'react-router-dom';
import ProjectModal from '../components/ProjectModal';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionPercentage: 0,
    recentTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateProject = async (data) => {
    try {
      await API.post('/projects', data);
      setOpenModal(false);
      fetchStats();
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await API.put(`/tasks/${task.id}`, { status: newStatus });
      fetchStats();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero Welcome Banner */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <SparklesIcon sx={{ color: '#F59E0B', fontSize: 24 }} className="float-icon" />
            <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800 }}>
              👋 Hello, {user?.name || 'Developer'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: '#9CA3AF', fontSize: '1.05rem' }}>
            Here is your real-time engineering productivity workspace for today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            py: 1.3,
            px: 3,
            fontWeight: 800,
            bgcolor: '#6366F1',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            '&:hover': { bgcolor: '#4F46E5', boxShadow: '0 0 35px rgba(99, 102, 241, 0.7)' },
          }}
        >
          New Project
        </Button>
      </Box>

      {/* Analytics Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon={<ProjectIcon />}
            color="#6366F1"
            subtitle="Active workspace projects"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tasks"
            value={stats.totalTasks}
            icon={<TaskIcon />}
            color="#06B6D4"
            subtitle="Total assigned work items"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={<CompleteIcon />}
            color="#10B981"
            subtitle="Finished developer tasks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pendingTasks}
            icon={<PendingIcon />}
            color="#F59E0B"
            subtitle="Remaining in backlog"
          />
        </Grid>
      </Grid>

      {/* Visual Analytics Graphs */}
      <Box sx={{ mb: 4 }}>
        <AnalyticsCharts stats={stats} />
      </Box>

      {/* Progress Metric & Recent Tasks */}
      <Grid container spacing={3}>
        {/* Productivity Completion Gauge */}
        <Grid item xs={12} md={5}>
          <Card
            className="glass-card glow-border"
            sx={{
              height: '100%',
              p: 3,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <RocketIcon sx={{ color: '#38BDF8', fontSize: 26 }} className="float-icon" />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                  Developer Productivity Rate
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3, lineHeight: 1.6 }}>
                Sprint task completion efficiency based on overall active project tasks.
              </Typography>

              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#38BDF8' }}>
                    {stats.completionPercentage}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', alignSelf: 'flex-end', fontWeight: 600 }}>
                    {stats.completedTasks} / {stats.totalTasks} Tasks Done
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.completionPercentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: 'linear-gradient(90deg, #6366F1 0%, #38BDF8 50%, #10B981 100%)',
                      boxShadow: '0 0 16px rgba(56, 189, 248, 0.7)',
                    },
                  }}
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/projects')}
              sx={{
                mt: 3,
                borderColor: 'rgba(99, 102, 241, 0.4)',
                color: '#818CF8',
                fontWeight: 700,
                py: 1.2,
                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', borderColor: '#6366F1' }
              }}
            >
              Open Projects Workspace
            </Button>
          </Card>
        </Grid>

        {/* Recent Tasks Widget */}
        <Grid item xs={12} md={7}>
          <Card
            className="glass-card"
            sx={{
              p: 3,
              background: 'rgba(17, 24, 39, 0.8)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TerminalIcon sx={{ color: '#A855F7' }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                  Recent Tasks
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => navigate('/tasks')}
                sx={{ color: '#818CF8', fontWeight: 700 }}
              >
                View All →
              </Button>
            </Box>

            {stats.recentTasks.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#9CA3AF', py: 4, textAlign: 'center' }}>
                No tasks created yet. Click "New Project" to start tracking work!
              </Typography>
            ) : (
              <motion.div variants={containerStagger} initial="hidden" animate="show">
                {stats.recentTasks.map((task) => (
                  <motion.div key={task.id} variants={itemFadeIn}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1.5,
                        px: 2,
                        mb: 1,
                        borderRadius: 2.5,
                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          transform: 'translateX(4px)'
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleTaskStatus(task)}
                          sx={{ color: task.status === 'COMPLETED' ? '#10B981' : '#9CA3AF' }}
                        >
                          {task.status === 'COMPLETED' ? (
                            <CheckCircleOutline fontSize="small" />
                          ) : (
                            <RadioButtonUnchecked fontSize="small" />
                          )}
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{
                            color: task.status === 'COMPLETED' ? '#9CA3AF' : '#F9FAFB',
                            textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                            fontWeight: 600,
                          }}
                        >
                          {task.title}
                        </Typography>
                      </Box>

                      <Chip
                        label={task.project.title}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(99, 102, 241, 0.15)',
                          color: '#818CF8',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Card>
        </Grid>
      </Grid>

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateProject}
      />
    </motion.div>
  );
};

export default Dashboard;
