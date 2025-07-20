const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('❌ No or invalid Authorization header');
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.warn('❌ Token missing after Bearer');
    return res.status(401).json({ error: 'Token not found in Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // Ensure your token payload includes `id` and `role`
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
