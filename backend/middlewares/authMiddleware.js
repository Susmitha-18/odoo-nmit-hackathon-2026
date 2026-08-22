const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route. Token missing.' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
    }

    req.user = {
      id: user._id.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

module.exports = authMiddleware;
