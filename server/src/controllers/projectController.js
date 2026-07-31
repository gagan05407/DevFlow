const prisma = require('../config/prisma');

// @desc    Get all projects belonging to or shared with the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const whereClause = {
      OR: [
        { userId: req.user.id },
        { members: { some: { userId: req.user.id, status: 'ACCEPTED' } } }
      ],
      ...(search && {
        AND: [
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } }
            ]
          }
        ]
      })
    };

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: order.toLowerCase() === 'asc' ? 'asc' : 'desc'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        members: {
          where: { status: 'ACCEPTED' },
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true }
            }
          }
        },
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    const formattedProjects = projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const { tasks, ...projectWithoutTasks } = project;
      return {
        ...projectWithoutTasks,
        totalTasks,
        completedTasks,
        progress
      };
    });

    res.status(200).json({
      status: 'success',
      results: formattedProjects.length,
      data: {
        projects: formattedProjects
      }
    });
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching projects',
      error: error.message
    });
  }
};

// @desc    Get a single project by ID with its tasks and members
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);

    if (isNaN(projectId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid project ID' });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: req.user.id },
          { members: { some: { userId: req.user.id, status: 'ACCEPTED' } } }
        ]
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } }
          }
        },
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    console.error('Get Project By ID Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching project',
      error: error.message
    });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, githubUrl, deadline } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        githubUrl: githubUrl || null,
        deadline: deadline ? new Date(deadline) : null,
        userId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER',
            status: 'ACCEPTED'
          }
        }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } }
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating project',
      error: error.message
    });
  }
};

// @desc    Update an existing project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const { title, description, githubUrl, deadline } = req.body;

    if (isNaN(projectId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid project ID' });
    }

    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id }
    });

    if (!existingProject) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found or unauthorized'
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description: description !== undefined ? description : existingProject.description,
        githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
        deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : existingProject.deadline
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating project',
      error: error.message
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);

    if (isNaN(projectId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid project ID' });
    }

    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id }
    });

    if (!existingProject) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found or unauthorized'
      });
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting project',
      error: error.message
    });
  }
};

// @desc    Invite a user to a project by email
// @route   POST /api/projects/:id/invite
// @access  Private
const inviteMember = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'fail', message: 'Email address is required' });
    }

    // Verify requesting user is owner
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      return res.status(403).json({ status: 'fail', message: 'Only project owner can send invitations' });
    }

    // Find invited user by email
    const targetUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!targetUser) {
      return res.status(404).json({ status: 'fail', message: 'No user account found with this email' });
    }

    if (targetUser.id === req.user.id) {
      return res.status(400).json({ status: 'fail', message: 'You are already the owner of this project' });
    }

    // Check if membership already exists
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: targetUser.id }
      }
    });

    if (existingMember) {
      return res.status(400).json({
        status: 'fail',
        message: existingMember.status === 'ACCEPTED'
          ? 'User is already a member of this project'
          : 'An invitation has already been sent to this user'
      });
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId: targetUser.id,
        role: 'MEMBER',
        status: 'PENDING'
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    });

    res.status(201).json({
      status: 'success',
      message: `Invitation sent to ${targetUser.email}`,
      data: { member: newMember }
    });
  } catch (error) {
    console.error('Invite Member Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to invite member', error: error.message });
  }
};

// @desc    Get user's pending invitations
// @route   GET /api/projects/invites
// @access  Private
const getPendingInvites = async (req, res) => {
  try {
    const invites = await prisma.projectMember.findMany({
      where: {
        userId: req.user.id,
        status: 'PENDING'
      },
      include: {
        project: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } }
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: invites.length,
      data: { invites }
    });
  } catch (error) {
    console.error('Get Pending Invites Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch invites', error: error.message });
  }
};

// @desc    Accept or decline an invitation
// @route   PATCH /api/projects/invites/:inviteId
// @access  Private
const respondToInvite = async (req, res) => {
  try {
    const inviteId = parseInt(req.params.inviteId, 10);
    const { action } = req.body; // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ status: 'fail', message: 'Action must be accept or decline' });
    }

    const invite = await prisma.projectMember.findFirst({
      where: { id: inviteId, userId: req.user.id, status: 'PENDING' }
    });

    if (!invite) {
      return res.status(404).json({ status: 'fail', message: 'Invitation not found' });
    }

    if (action === 'accept') {
      const updated = await prisma.projectMember.update({
        where: { id: inviteId },
        data: { status: 'ACCEPTED' }
      });
      return res.status(200).json({ status: 'success', message: 'Invitation accepted!', data: { invite: updated } });
    } else {
      await prisma.projectMember.delete({ where: { id: inviteId } });
      return res.status(200).json({ status: 'success', message: 'Invitation declined' });
    }
  } catch (error) {
    console.error('Respond to Invite Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to respond to invite', error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  inviteMember,
  getPendingInvites,
  respondToInvite
};
