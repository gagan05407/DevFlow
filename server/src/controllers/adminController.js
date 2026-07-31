const prisma = require('../config/prisma');

// @desc    Get system-wide admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.project.count();
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({
      where: { status: 'COMPLETED' }
    });
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalProjects,
        totalTasks,
        completedTasks,
        adminCount
      }
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching admin statistics',
      error: error.message
    });
  }
};

// @desc    Get all users with project & task counts
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            projects: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching users list',
      error: error.message
    });
  }
};

// @desc    Update user role (USER <-> ADMIN)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role. Role must be USER or ADMIN'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      status: 'success',
      message: `User role updated to ${role} successfully`,
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update User Role Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating user role',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Prevent deleting oneself
    if (userId === req.user.id) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot delete your own admin account.'
      });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({
      status: 'success',
      message: 'User account and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting user account',
      error: error.message
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser
};
