module.exports = {
    jwtSecret: process.env.jwtSecret, // Replace with a secure and secret key
    jwtExpiration: process.env.jwtExpiration, // Token expiration time (e.g., 1 day)
    facebookAuth: {
      clientID: process.env.facebookAuthClientID,
      clientSecret: process.env.facebookAuthClientSecret,
      callbackURL: process.env.facebookAuthCallbackURL, // Update with server's URL
    },
    googleAuth: {
      clientID: process.env.googleAuthClientID,
      clientSecret: process.env.googleAuthClientSecret,
      callbackURL: process.env.googleAuthCallbackURL, // Update with  server's URL
    },
  };
  