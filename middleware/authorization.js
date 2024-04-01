const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token)

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
    // console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  authorize
};
