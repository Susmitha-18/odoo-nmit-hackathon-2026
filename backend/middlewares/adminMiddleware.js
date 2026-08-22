const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Access restricted to Admin / HR Officers only.'
    });
  }
  next();
};

module.exports = adminMiddleware;
