const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      status: 'fail',
      message: 'Access denied. Administrator privileges required.'
    });
  }
};

module.exports = { adminOnly };
