const express = require("express");
const userRouter = express.Router();

// Acquiring middleware for safe routes
const { authorize } = require("../middleware/authorization");

// Acquiring functions from user controller
const { contactUs, getUserById, deleteUserAndAssociatedLinks } = require("../controllers/userController");

// Fetching all record of a user based on their Id
userRouter.get("/:id", authorize,  getUserById);

// Route for deleting a user and associated links
userRouter.delete("/:id/delete", authorize, deleteUserAndAssociatedLinks);

// Route for sending any feedback using contact form
userRouter.post('/:userId/contact', authorize, contactUs);

module.exports = userRouter;