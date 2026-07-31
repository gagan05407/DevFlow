import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Avatar,
  Box,
  Typography
} from '@mui/material';

const TaskModal = ({ open, onClose, onSubmit, initialData = null, projects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: 'Feature',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: '',
    projectId: '',
    assignedToUserId: '',
  });

  const selectedProject = projects.find(p => p.id === parseInt(formData.projectId, 10)) || projects[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        tag: initialData.tag || 'Feature',
        status: initialData.status || 'PENDING',
        priority: initialData.priority || 'MEDIUM',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        projectId: initialData.projectId || (projects[0] ? projects[0].id : ''),
        assignedToUserId: initialData.assignedToUserId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        tag: 'Feature',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        projectId: projects[0] ? projects[0].id : '',
        assignedToUserId: '',
      });
    }
  }, [initialData, open, projects]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Compile list of assignable users (owner + accepted members)
  const assignableUsers = [];
  if (selectedProject) {
    if (selectedProject.user) {
      assignableUsers.push(selectedProject.user);
    }
    if (selectedProject.members) {
      selectedProject.members.forEach(m => {
        if (m.user && !assignableUsers.some(u => u.id === m.user.id)) {
          assignableUsers.push(m.user);
        }
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: '#1E293B',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#F9FAFB' }}>
        {initialData ? 'Edit Task' : 'Create & Assign Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            name="title"
            label="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="projectId"
                label="Assign to Project"
                value={formData.projectId}
                onChange={handleChange}
                required
                fullWidth
                disabled={!!initialData}
              >
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
                    {proj.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="assignedToUserId"
                label="Assign To Teammate"
                value={formData.assignedToUserId}
                onChange={handleChange}
                fullWidth
                helperText="Select project member to work on this task"
              >
                <MenuItem value="">Unassigned</MenuItem>
                {assignableUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={u.avatarUrl || undefined} sx={{ width: 22, height: 22, fontSize: 11 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{u.name} ({u.email})</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="tag"
                label="Task Tag / Label"
                value={formData.tag}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="Feature">Feature</MenuItem>
                <MenuItem value="Frontend">Frontend</MenuItem>
                <MenuItem value="Backend">Backend</MenuItem>
                <MenuItem value="Bug">Bug Fix</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
                <MenuItem value="DevOps">DevOps</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="priority"
                label="Priority"
                value={formData.priority}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dueDate"
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: '#9CA3AF' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, fontWeight: 700 }}>
            {initialData ? 'Update Task' : 'Create & Assign Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
