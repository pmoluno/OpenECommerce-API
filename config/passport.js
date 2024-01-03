const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const authConfig = require('./auth');

module.exports = () => {
  // Local Authentication Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Email not found' });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid password' });
          }

          return done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  // Facebook Authentication Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: authConfig.facebookAuth.clientID,
        clientSecret: authConfig.facebookAuth.clientSecret,
        callbackURL: authConfig.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'email'],
      },
      async (token, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ facebookId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = new User({
            facebookId: profile.id,
            fullName: profile.displayName,
            tokens: [token],
          });

          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  // Google Authentication Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: authConfig.googleAuth.clientID,
        clientSecret: authConfig.googleAuth.clientSecret,
        callbackURL: authConfig.googleAuth.callbackURL,
      },
      async (token, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            tokens: [token],
          });

          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
