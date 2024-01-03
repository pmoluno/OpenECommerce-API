
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const InvalidToken = require('../models/invalidToken'); 
const router = express.Router();

// Facebook authentication route
router.get('/facebook', passport.authenticate('facebook'));

// Callback route for Facebook
router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    console.log(req);
  const user = req.user;
  const token = jwt.sign({ userId: user._id }, authConfig.jwtSecret, { expiresIn: authConfig.jwtExpiration });
  res.json({ token });
});

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user._id }, authConfig.jwtSecret, { expiresIn: authConfig.jwtExpiration });
  res.json({ token });
});

// Local registration route
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create a new user
    const newUser = new User({ fullName, email, password });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, authConfig.jwtSecret, { expiresIn: authConfig.jwtExpiration });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Local login route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user._id }, authConfig.jwtSecret, { expiresIn: authConfig.jwtExpiration });
  res.json({ token });
});


// User logout route (invalidate a specific JWT token)
router.post('/logout', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId; // Get the user's ID from the decoded token
      const tokenToInvalidate = req.headers.authorization; // Extract the token from the Authorization header
  
      // Check if the token to invalidate exists in the list of invalidated tokens
      const isTokenInvalidated = await InvalidToken.findOne({ token: tokenToInvalidate });
  
      if (isTokenInvalidated) {
        res.status(401).json({ message: 'Invalid token' });
      } else {
        // Add the token to the list of invalidated tokens
        const newInvalidToken = new InvalidToken({ token: tokenToInvalidate });
        await newInvalidToken.save();
  
        res.status(200).json({ message: 'Token revoked successfully' });
      }
    } catch (error) {
      console.error('Error revoking token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



module.exports = router;
