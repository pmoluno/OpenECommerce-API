require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session'); 
const authMiddleware = require('./middleware/auth');
const logger = require('./middleware/logging');
// Import configuration files
const databaseConfig = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
// Import route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Initialize Express app
const app = express();

// Connect to the database
mongoose.connect(databaseConfig.url)
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error:', err));

  app.use(
    session({
      secret: process.env.sessionSecret, // Replace with secret key
      resave: false,
      saveUninitialized: false,
    })
  );

// Middleware setup

app.use(helmet()); // Eable Security middleware
app.use(logger); // Request logging middleware
app.use(bodyParser.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Set various HTTP headers for security

app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
require('./config/passport')();

// API routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/user', authMiddleware, userRoutes); // User-related routes (protected by authMiddleware)


// Error handling middleware
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
