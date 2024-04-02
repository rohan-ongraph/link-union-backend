const express = require("express");
const router = express.Router();

// Acquiring functions from auth controller
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

// Creating a new user
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for logging out a user
router.get("/logout", logoutUser);

module.exports = router;