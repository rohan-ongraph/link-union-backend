const express = require("express");
const router = express.Router();

// Acquiring functions from auth controller
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const { authorize } = require("../middleware/authorization");

// Creating a new user
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for logging out a user
userRouter.get("/logout", authorize, logoutUser);

module.exports = router;