// middleware/auth.js
const jwt = require('jsonwebtoken');

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret'); // Replace 'secret' with env var in production
    req.user = decoded; // contains id, role
    // console.log(decoded);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

module.exports = tokenVerify;
