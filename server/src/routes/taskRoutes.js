const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { taskValidation, validateTask } = require('../middleware/taskValidation');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(taskValidation, validateTask, createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
