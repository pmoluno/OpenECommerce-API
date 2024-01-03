const morgan = require('morgan');

// Create a custom token format for logging
morgan.token('custom', (req, res) => {
  return [
    'Method:', req.method,
    'URL:', req.originalUrl,
    'Status:', res.statusCode,
    'Response Time:', `${res.responseTime}ms`
  ].join(' ');
});

// Initialize the morgan middleware with the custom token format
const logger = morgan('custom');

module.exports = logger;
