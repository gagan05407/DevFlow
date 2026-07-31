import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as MoveRightIcon,
  ArrowBack as MoveLeftIcon,
  CalendarToday as CalendarIcon,
  Label as TagIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const columns = [
  { id: 'PENDING', title: 'Pending Backlog', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.05)' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.05)' },
  { id: 'COMPLETED', title: 'Completed Tasks', color: '#10B981', bg: 'rgba(16, 185, 129, 0.05)' }
];

const priorityColors = {
  LOW: { label: 'Low', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  MEDIUM: { label: 'Medium', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  HIGH: { label: 'High', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

const tagColors = {
  Frontend: '#6366F1',
  Backend: '#8B5CF6',
  Bug: '#EF4444',
  Feature: '#10B981',
  Database: '#F59E0B',
  DevOps: '#EC4899'
};

const triggerConfetti = () => {
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#6366F1', '#10B981', '#38BDF8', '#F59E0B', '#A855F7']
  });
};

const KanbanBoard = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  const handleNextStatus = (currentStatus) => {
    if (currentStatus === 'PENDING') return 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') return 'COMPLETED';
    return null;
  };

  const handlePrevStatus = (currentStatus) => {
    if (currentStatus === 'COMPLETED') return 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') return 'PENDING';
    return null;
  };

  const handleStatusClick = (taskId, newStatus) => {
    if (newStatus === 'COMPLETED') {
      triggerConfetti();
    }
    onStatusChange(taskId, newStatus);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
      {columns.map((col) => {
        const colTasks = getTasksByStatus(col.id);

        return (
          <Paper
            key={col.id}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: `1px solid rgba(255, 255, 255, 0.08)`,
              minHeight: 500,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: col.bg,
                borderLeft: `4px solid ${col.color}`,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: col.color }}>
                {col.title}
              </Typography>
              <Chip
                label={colTasks.length}
                size="small"
                sx={{
                  backgroundColor: col.color,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 12
                }}
              />
            </Box>

            {/* Task Cards Container */}
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              {colTasks.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '2px dashed rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                    color: 'text.secondary'
                  }}
                >
                  <Typography variant="body2">No tasks in this stage</Typography>
                </Box>
              ) : (
                colTasks.map((task) => {
                  const pInfo = priorityColors[task.priority] || priorityColors.MEDIUM;
                  const nextStatus = handleNextStatus(task.status);
                  const prevStatus = handlePrevStatus(task.status);

                  return (
                    <Card
                      key={task.id}
                      component={motion.div}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      sx={{
                        backgroundColor: 'rgba(30, 41, 59, 0.6)',
                        borderRadius: 2.5,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        {/* Project Title Badge */}
                        {task.project?.title && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: '#818CF8',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              display: 'block',
                              mb: 0.5
                            }}
                          >
                            📁 {task.project.title}
                          </Typography>
                        )}

                        {/* Task Title */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                            color: task.status === 'COMPLETED' ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {task.title}
                        </Typography>

                        {/* Task Description */}
                        {task.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {task.description}
                          </Typography>
                        )}

                        {/* Assigned Teammate Badge */}
                        {task.assignedTo && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.8,
                              mb: 1.5,
                              py: 0.5,
                              px: 1,
                              borderRadius: 1.5,
                              bgcolor: 'rgba(99, 102, 241, 0.08)',
                              border: '1px solid rgba(99, 102, 241, 0.2)'
                            }}
                          >
                            <Avatar src={task.assignedTo.avatarUrl || undefined} sx={{ width: 20, height: 20, fontSize: 10, bgcolor: '#6366F1' }}>
                              {task.assignedTo.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                              Assigned to: <strong style={{ color: '#F8FAFC' }}>{task.assignedTo.name}</strong>
                            </Typography>
                          </Box>
                        )}

                        {/* Badges: Tag & Priority & Due Date */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {task.tag && (
                            <Chip
                              label={task.tag}
                              size="small"
                              icon={<TagIcon sx={{ fontSize: '14px !important' }} />}
                              sx={{
                                height: 22,
                                fontSize: 11,
                                fontWeight: 700,
                                bgcolor: 'rgba(255,255,255,0.06)',
                                border: `1px solid ${tagColors[task.tag] || '#6366F1'}`,
                                color: tagColors[task.tag] || '#6366F1'
                              }}
                            />
                          )}

                          <Chip
                            label={pInfo.label}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: 11,
                              fontWeight: 700,
                              backgroundColor: pInfo.bg,
                              color: pInfo.color
                            }}
                          />

                          {task.dueDate && (
                            <Chip
                              label={new Date(task.dueDate).toLocaleDateString()}
                              size="small"
                              icon={<CalendarIcon sx={{ fontSize: '14px !important' }} />}
                              sx={{
                                height: 22,
                                fontSize: 11,
                                color: 'text.secondary',
                                bgcolor: 'rgba(255,255,255,0.04)'
                              }}
                            />
                          )}
                        </Box>

                        {/* Card Footer Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {prevStatus && (
                              <Tooltip title={`Move to ${prevStatus.replace('_', ' ')}`}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleStatusClick(task.id, prevStatus)}
                                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                                >
                                  <MoveLeftIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {nextStatus && (
                              <Tooltip title={`Move to ${nextStatus.replace('_', ' ')}`}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleStatusClick(task.id, nextStatus)}
                                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                                >
                                  <MoveRightIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => onEdit(task)}
                              sx={{ color: 'text.secondary', '&:hover': { color: 'info.main' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(task.id)}
                              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export default KanbanBoard;
