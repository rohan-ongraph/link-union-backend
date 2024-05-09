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
    callbackURL: 'http://localhost:5000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    
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
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
  try {
      // Extract user information from the request      
      const { displayName, emails } = req.user;
      const email = emails[0].value;

      // Check if the user already exists in your database
      let user = await userModel.findOne({ email });

      if (!user) {
          // If the user doesn't exist, create a new user in the database
          user = new userModel({
              fullname: displayName,
              email,
              // You can set a default password or leave it blank as per your requirements
          });
          await user.save();
      }

      const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            fullname: user.fullname,
        },
        process.env.TOKEN_SECRET_KEY
    );

    // Set token in a cookie
    res.cookie("token", token); // Store the token in an HTTP-only cookie

    // Redirect to your Angular app after successful authentication
    res.redirect(`http://localhost:4200/list`);

    
  } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error handling Google authentication callback:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Export the router
module.exports = router;