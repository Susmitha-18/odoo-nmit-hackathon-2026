const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_2026_nmit_hackathon',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_2026_nmit_hackathon'
  );
};

module.exports = { generateToken, verifyToken };
