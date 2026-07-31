const prisma = require('../config/prisma');

// @desc    Get tasks with searching, filtering, member assignments & pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const {
      projectId,
      status,
      priority,
      tag,
      search,
      assignedToMe,
      assignedToUserId,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = {
      project: {
        OR: [
          { userId: req.user.id },
          { members: { some: { userId: req.user.id, status: 'ACCEPTED' } } }
        ]
      },
      ...(projectId && { projectId: parseInt(projectId, 10) }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(tag && { tag }),
      ...(assignedToMe === 'true' && { assignedToUserId: req.user.id }),
      ...(assignedToUserId && { assignedToUserId: parseInt(assignedToUserId, 10) }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tag: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [total, tasks] = await Promise.all([
      prisma.task.count({ where: whereClause }),
      prisma.task.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy]: order.toLowerCase() === 'asc' ? 'asc' : 'desc'
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              userId: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        tasks
      }
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tasks',
      error: error.message
    });
  }
};

// @desc    Create a new task and assign to project member
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, tag, status, priority, dueDate, projectId, assignedToUserId } = req.body;
    const parsedProjectId = parseInt(projectId, 10);

    const project = await prisma.project.findFirst({
      where: {
        id: parsedProjectId,
        OR: [
          { userId: req.user.id },
          { members: { some: { userId: req.user.id, status: 'ACCEPTED' } } }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found or unauthorized'
      });
    }

    let parsedAssignedUserId = assignedToUserId ? parseInt(assignedToUserId, 10) : req.user.id;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        tag: tag || 'Feature',
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parsedProjectId,
        assignedToUserId: parsedAssignedUserId
      },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating task',
      error: error.message
    });
  }
};

// @desc    Update task details, status, or assignee
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, tag, status, priority, dueDate, assignedToUserId } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid task ID' });
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { userId: req.user.id },
            { members: { some: { userId: req.user.id, status: 'ACCEPTED' } } }
          ]
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found or unauthorized'
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(tag !== undefined && { tag }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assignedToUserId !== undefined && { assignedToUserId: assignedToUserId ? parseInt(assignedToUserId, 10) : null })
      },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating task',
      error: error.message
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid task ID' });
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { userId: req.user.id },
            { members: { some: { userId: req.user.id, status: 'ACCEPTED' } } }
          ]
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found or unauthorized'
      });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting task',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
