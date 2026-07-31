import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const ProjectModal = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    deadline: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        githubUrl: initialData.githubUrl || '',
        deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
      });
    } else {
      setFormData({ title: '', description: '', githubUrl: '', deadline: '' });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
        {initialData ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            name="title"
            label="Project Title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="githubUrl"
            label="GitHub Repository URL (Optional)"
            value={formData.githubUrl}
            onChange={handleChange}
            fullWidth
            placeholder="https://github.com/username/repository"
            helperText="Link a GitHub repository to display live stars, issues, and language stats."
          />
          <TextField
            name="deadline"
            label="Deadline Date"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: '#9CA3AF' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, fontWeight: 700 }}>
            {initialData ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectModal;
