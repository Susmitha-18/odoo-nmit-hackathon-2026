const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Authentication token required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User no longer exists' });
    }

    req.user = {
      id: user._id.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token', error: error.message });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${allowedRoles.join(' or ')} role only`
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};
