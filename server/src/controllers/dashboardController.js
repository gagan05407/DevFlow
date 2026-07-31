const prisma = require('../config/prisma');

// @desc    Get dashboard metrics (Total projects, tasks breakdown, upcoming deadlines)
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch total project count
    const totalProjects = await prisma.project.count({
      where: { userId }
    });

    // Fetch total, completed, pending tasks
    const [totalTasks, completedTasks, pendingTasks, upcomingDeadlines, recentTasks] = await Promise.all([
      prisma.task.count({
        where: { project: { userId } }
      }),
      prisma.task.count({
        where: { project: { userId }, status: 'COMPLETED' }
      }),
      prisma.task.count({
        where: { project: { userId }, status: { in: ['PENDING', 'IN_PROGRESS'] } }
      }),
      // Fetch upcoming project or task deadlines in next 7 days
      prisma.task.findMany({
        where: {
          project: { userId },
          status: { not: 'COMPLETED' },
          dueDate: { gte: new Date() }
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: {
          project: { select: { title: true } }
        }
      }),
      // Fetch recent 5 tasks
      prisma.task.findMany({
        where: { project: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          project: { select: { title: true } }
        }
      })
    ]);

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage,
        upcomingDeadlines,
        recentTasks
      }
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching dashboard metrics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
