const express = require("express");
const linkRouter = express.Router();

// Acquiring middleware for safe routes
const { authorize } = require("../middleware/authorization");

// Acquiring the functions from link controller
const {
  createNewLink,
  getAllLinks,
  getLink,
  deleteLink,
  deleteAllLinks,
  editLink,
} = require("../controllers/linkController");

// Route for adding a link
linkRouter.post("/:userId/add-link", authorize, createNewLink);

// Route for getting a link
linkRouter.get("/:userId/links/:linkId", authorize, getLink);

// Route for fetching all links of a specific user
linkRouter.get("/:userId/links",  getAllLinks);

// Route for deleting a link
linkRouter.delete("/:userId/delete-link/:linkId", authorize, deleteLink);

// Route for deleting all links of a user
linkRouter.delete("/:userId/delete-all-links", authorize, deleteAllLinks);

// Route for editing a link
linkRouter.put("/:userId/edit-link/:linkId", authorize, editLink);

module.exports = linkRouter;