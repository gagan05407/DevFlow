const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  inviteMember,
  getPendingInvites,
  respondToInvite
} = require('../controllers/projectController');
const { projectValidation, validateProject } = require('../middleware/projectValidation');
const { protect } = require('../middleware/authMiddleware');

// All project routes require authentication
router.use(protect);

router.get('/invites', getPendingInvites);
router.patch('/invites/:inviteId', respondToInvite);

router.route('/')
  .get(getProjects)
  .post(projectValidation, validateProject, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(projectValidation, validateProject, updateProject)
  .delete(deleteProject);

router.post('/:id/invite', inviteMember);

module.exports = router;
