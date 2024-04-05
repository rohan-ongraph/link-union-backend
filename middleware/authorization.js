const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
  try {
    const authorizationHeader = req.headers['x-auth-token'];
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  authorize
};
