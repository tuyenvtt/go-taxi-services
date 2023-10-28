const { getConfig } = require('@common/utils/config');
const jwt = require('jsonwebtoken');

function authenticated (req, res, next) {
  try {
    let token = req.cookies.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }

      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
    }

    const secretKey = getConfig('common.secret.authen');
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (decoded.eat < Date.now()) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }

    req.payload = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticated;
