import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline,
  RadioButtonUnchecked,
  ViewKanban as KanbanIcon,
  ViewList as ListIcon,
  Person as PersonIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import TaskModal from '../components/TaskModal';
import KanbanBoard from '../components/KanbanBoard';
import API from '../services/api';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const priorityColors = {
  LOW: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34D399' },
  MEDIUM: { bg: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' },
  HIGH: { bg: 'rgba(239, 68, 68, 0.15)', color: '#F87171' },
};

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState('kanban');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [assignedToMe, setAssignedToMe] = useState(false);

  // Modals
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data.projects);
    } catch (err) {
      console.error('Error fetching user projects:', err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        projectId: projectFilter || undefined,
        assignedToMe: assignedToMe ? 'true' : undefined
      };
      const res = await API.get('/tasks', { params });
      setTasks(res.data.data.tasks);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error('Error loading tasks:', err);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage, search, statusFilter, priorityFilter, projectFilter, assignedToMe]);

  const handleToggleStatus = async (taskOrId, targetStatus) => {
    try {
      const taskId = typeof taskOrId === 'object' ? taskOrId.id : taskOrId;
      const newStatus = targetStatus || (taskOrId.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED');
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast.error('Failed to update task status');
    }
  };

  const handleOpenCreateModal = () => {
    setEditTask(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (task) => {
    setEditTask(task);
    setOpenModal(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      if (editTask) {
        await API.put(`/tasks/${editTask.id}`, formData);
        toast.success('Task updated successfully!');
      } else {
        await API.post('/tasks', formData);
        toast.success('Task created and assigned successfully!');
      }
      setOpenModal(false);
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
      toast.error(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        toast.success('Task deleted successfully!');
        fetchTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
            Task Workspace & Delegation
          </Typography>
          <Typography variant="body1" sx={{ color: '#9CA3AF', mt: 0.5 }}>
            Assign, manage, and track team member engineering tasks.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Quick Filter: Assigned to Me */}
          <Button
            variant={assignedToMe ? 'contained' : 'outlined'}
            color="primary"
            startIcon={assignedToMe ? <PersonIcon /> : <GroupIcon />}
            onClick={() => setAssignedToMe(!assignedToMe)}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {assignedToMe ? 'Assigned To Me' : 'All Team Tasks'}
          </Button>

          {/* View Mode Switcher */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <ToggleButton value="kanban" sx={{ color: '#9CA3AF', '&.Mui-selected': { bgcolor: '#6366F1', color: '#fff' } }}>
              <KanbanIcon sx={{ mr: 1, fontSize: 18 }} /> Kanban
            </ToggleButton>
            <ToggleButton value="list" sx={{ color: '#9CA3AF', '&.Mui-selected': { bgcolor: '#6366F1', color: '#fff' } }}>
              <ListIcon sx={{ mr: 1, fontSize: 18 }} /> Table
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
            disabled={projects.length === 0}
            sx={{ py: 1.2, px: 2.5, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, fontWeight: 700 }}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      {/* Filter Controls Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            placeholder="Search tasks by title, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6} sm={2.6}>
          <TextField
            select
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} sm={2.6}>
          <TextField
            select
            label="Filter Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={2.8}>
          <TextField
            select
            label="Filter Project"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Main Content: Kanban Board or Table View */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#6366F1' }} size={48} />
        </Box>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleToggleStatus}
        />
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#111827', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1E293B' }}>
              <TableRow>
                <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>STATUS</TableCell>
                <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>TASK TITLE</TableCell>
                <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>ASSIGNED TO</TableCell>
                <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>TAG</TableCell>
                <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>PROJECT</TableCell>
                <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>PRIORITY</TableCell>
                <TableCell align="right" sx={{ color: '#9CA3AF', fontWeight: 700 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#9CA3AF' }}>
                    No tasks found matching your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleToggleStatus(task)}>
                        {task.status === 'COMPLETED' ? (
                          <CheckCircleOutline sx={{ color: '#10B981' }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: '#9CA3AF' }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: task.status === 'COMPLETED' ? '#9CA3AF' : '#F9FAFB',
                          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {task.assignedTo ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={task.assignedTo.avatarUrl || undefined} sx={{ width: 22, height: 22, fontSize: 10, bgcolor: '#6366F1' }}>
                            {task.assignedTo.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: task.assignedTo.id === user?.id ? '#38BDF8' : '#F8FAFC', fontWeight: 600 }}>
                            {task.assignedTo.name} {task.assignedTo.id === user?.id && '(You)'}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>Unassigned</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.tag || 'Feature'}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          color: '#818CF8'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#818CF8', fontWeight: 500 }}>
                        {task.project?.title || 'General'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityColors[task.priority]?.bg,
                          color: priorityColors[task.priority]?.color,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Task">
                        <IconButton size="small" onClick={() => handleOpenEditModal(task)} sx={{ color: '#9CA3AF', '&:hover': { color: '#6366F1' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Task">
                        <IconButton size="small" onClick={() => handleDeleteTask(task.id)} sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{ color: '#9CA3AF' }}
          />
        </TableContainer>
      )}

      <TaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSaveTask}
        initialData={editTask}
        projects={projects}
      />
    </motion.div>
  );
};

export default Tasks;
