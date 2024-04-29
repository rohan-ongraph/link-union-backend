const express = require("express");
const router = express.Router();
const passport = require("passport")
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv'); 
dotenv.config();

// Acquiring functions from auth controller
const { registerUser, loginUser } = require("../controllers/authController");

// Creating a new user
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://link-union-backend.onrender.com/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Check if the user already exists in your database
    // If they do, return the user object
    // If they don't, create a new user and save it to your database
    // Then return the new user object
    return done(null, profile);
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Setup session middleware
router.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET',
  cookie: { secure: false }
}));

router.use(passport.initialize());
router.use(passport.session());
// Initialize passport middleware

// Google OAuth route for login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth callback route
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async(req, res) => {
  console.log("inside callback")
  // process.exit();
  res.redirect('https://link-union.netlify.app/list'); // Redirect to your Angular app
});

// Export the router
module.exports = router;