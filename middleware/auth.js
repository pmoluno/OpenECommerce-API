const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const InvalidToken = require('../models/invalidToken'); 

module.exports = async (req, res, next) => {
  const theAuthorizationHeader = req.headers.authorization;
  function extractToken(authorizationHeader) {
    const bearerPrefix = 'Bearer ';
    if (authorizationHeader && authorizationHeader.startsWith(bearerPrefix)) {
        return authorizationHeader.slice(bearerPrefix.length);
    } else {
        return null;
    }
  }
  const token = extractToken(theAuthorizationHeader);
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, authConfig.jwtSecret);

    // Check if the token has been invalidated
    const isTokenInvalidated = await InvalidToken.findOne({ token });

    if (isTokenInvalidated) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user data to the request object for future use in routes
    req.user = decodedToken;

    // Check if the token has expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
