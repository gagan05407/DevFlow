import React from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart as ChartIcon, PieChart as PieIcon, DonutLarge as DonutIcon } from '@mui/icons-material';

const AnalyticsCharts = ({ stats }) => {
  const { totalTasks = 0, completedTasks = 0, pendingTasks = 0, completionPercentage = 0 } = stats;

  // Calculate SVG Pie chart stroke dash offsets
  const circumference = 2 * Math.PI * 40; // radius = 40
  const completedOffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* Donut Chart Widget */}
      <Grid item xs={12} md={6}>
        <Card
          className="glass-card"
          sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <DonutIcon sx={{ color: '#6366F1' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
              Task Status Distribution Chart
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 3, py: 1 }}>
            {/* Custom SVG Donut Chart */}
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="140" height="140" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(245, 158, 11, 0.2)"
                  strokeWidth="12"
                />
                {/* Completed Slice Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: completedOffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
                  {completionPercentage}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: 10 }}>
                  Done
                </Typography>
              </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <Typography variant="body2" sx={{ color: '#F9FAFB', fontWeight: 600 }}>
                  Completed Tasks: <strong>{completedTasks}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
                <Typography variant="body2" sx={{ color: '#F9FAFB', fontWeight: 600 }}>
                  Pending Backlog: <strong>{pendingTasks}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
                <Typography variant="body2" sx={{ color: '#F9FAFB', fontWeight: 600 }}>
                  Total Assigned: <strong>{totalTasks}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* Priority Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card
          className="glass-card"
          sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <ChartIcon sx={{ color: '#06B6D4' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
              Sprint Priority Breakdown
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 700 }}>
                  🔥 High Priority
                </Typography>
                <Chip label="Critical" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', height: 20, fontSize: 10, fontWeight: 700 }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalTasks ? Math.min(100, Math.round((pendingTasks * 0.4 / Math.max(1, totalTasks)) * 100)) : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  '& .MuiLinearProgress-bar': { bgcolor: '#EF4444', borderRadius: 4 }
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                  ⚡ Medium Priority
                </Typography>
                <Chip label="Normal" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', height: 20, fontSize: 10, fontWeight: 700 }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalTasks ? Math.min(100, Math.round((totalTasks * 0.5 / Math.max(1, totalTasks)) * 100)) : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  '& .MuiLinearProgress-bar': { bgcolor: '#F59E0B', borderRadius: 4 }
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>
                  🌱 Low Priority
                </Typography>
                <Chip label="Minor" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', height: 20, fontSize: 10, fontWeight: 700 }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalTasks ? Math.min(100, Math.round((completedTasks * 0.3 / Math.max(1, totalTasks)) * 100)) : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  '& .MuiLinearProgress-bar': { bgcolor: '#10B981', borderRadius: 4 }
                }}
              />
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AnalyticsCharts;
