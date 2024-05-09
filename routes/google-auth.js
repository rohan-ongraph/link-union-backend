// Import necessary modules
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv'); // Module for loading environment variables from a .env file
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    
    return done(null, profile);
  }
));

// Create an Express router
const googleRouter = express.Router();

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Setup session middleware
googleRouter.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET',
  cookie: { secure: false }
}));

// Initialize passport middleware
googleRouter.use(passport.initialize());
googleRouter.use(passport.session());

// Google OAuth route for login
googleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
googleRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Redirect or respond with user data/token
  res.redirect('/profile');
});

// Export the router
module.exports = googleRouter;