import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FolderOff as EmptyIcon,
} from '@mui/icons-material';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import API from '../services/api';
import { motion } from 'framer-motion';
import { pageVariants, containerStagger, itemFadeIn } from '../animations/variants';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const fetchProjects = async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await API.get('/projects', {
        params: { search: searchQuery },
      });
      setProjects(res.data.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchProjects(val);
  };

  const handleOpenCreateModal = () => {
    setEditProject(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (project) => {
    setEditProject(project);
    setOpenModal(true);
  };

  const handleSaveProject = async (formData) => {
    try {
      if (editProject) {
        await API.put(`/projects/${editProject.id}`, formData);
        toast.success('Project updated successfully!');
      } else {
        await API.post('/projects', formData);
        toast.success('Project created successfully!');
      }
      setOpenModal(false);
      fetchProjects(search);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Error saving project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All child tasks will be deleted!')) {
      try {
        await API.delete(`/projects/${id}`);
        toast.success('Project deleted successfully!');
        fetchProjects(search);
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
            Projects Workspace
          </Typography>
          <Typography variant="body1" sx={{ color: '#9CA3AF', mt: 0.5 }}>
            Organize, manage, and monitor all your development projects & team collaborations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{ py: 1.2, px: 2.5, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, fontWeight: 700 }}
        >
          Create Project
        </Button>
      </Box>

      {/* Filter & Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search projects by title or description..."
          value={search}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Projects Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#6366F1' }} />
        </Box>
      ) : projects.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            bgcolor: '#111827',
            borderRadius: 4,
            border: '1px border-dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <EmptyIcon sx={{ fontSize: 64, color: '#4B5563', mb: 2 }} />
          <Typography variant="h4" sx={{ color: '#F3F4F6', mb: 1 }}>
            No Projects Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
            {search ? 'No projects matched your search criteria.' : 'You haven’t created any projects yet.'}
          </Typography>
          <Button variant="contained" onClick={handleOpenCreateModal} sx={{ bgcolor: '#6366F1', fontWeight: 700 }}>
            Create Your First Project
          </Button>
        </Box>
      ) : (
        <motion.div variants={containerStagger} initial="hidden" animate="show">
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <motion.div variants={itemFadeIn}>
                  <ProjectCard
                    project={project}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteProject}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSaveProject}
        initialData={editProject}
      />
    </motion.div>
  );
};

export default Projects;
