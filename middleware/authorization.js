// Importing the jsonwebtoken library for handling JWT (JSON Web Tokens) in Node.js
const jwt = require('jsonwebtoken');

// Middleware function to authorize requests
const authorize = (req, res, next) => {
  try {
    // Extracting the 'authorization' header from the request
    const authorizationHeader = req.headers['authorization'];
    
    // If 'authorization' header is missing, return 401 Unauthorized status
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Splitting the authorization header to get the token part
    const token = authorizationHeader.split(' ')[1];
    
    // If token is missing, return 401 Unauthorized status
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verifying the token using the provided secret key
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
      // If verification fails, return 403 Forbidden status
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      // If verification succeeds, attach the user data to the request object
      req.user = user;
      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Catching and handling unexpected errors, return 500 Internal Server Error status
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Exporting the authorize middleware function for use in other modules
module.exports = {
  authorize
};
