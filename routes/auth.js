const express = require("express");
const router = express.Router();
const passport = require("passport")

// Acquiring functions from auth controller
const { registerUser, loginUser } = require("../controllers/authController");

// Creating a new user
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Google sign-in route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home or send response with token
    res.redirect('/');
  }
);

module.exports = router;