// Importing necessary models for handling user and link data
const userModel = require("../models/user");
const linkModel = require("../models/link");

// Function to create a new link for a user
const createNewLink = async (req, res) => {
  try {
    // Extracting userId from request parameters
    const userId = req.params.userId;

    // Check if the user exists
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extracting link details from request body
    const { name, link, desc, tags } = req.body;

    // Creating a new link instance associated with the user
    const newLink = new linkModel({ userId, name, link, desc, tags });

    // Saving the new link
    await newLink.save();

    // Responding with success message
    res.status(201).json({ message: "Link created successfully" });
  } catch (error) {
    // Handling any internal server error
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to retrieve a single link
const getLink = async (req, res) => {
  try {
    // Extracting linkId from request parameters
    const linkId = req.params.linkId;

    // Finding the link by its ID
    const link = await linkModel.findById(linkId);

    // If link not found, respond with 404 status and message
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Responding with the retrieved link
    res.json(link);
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to retrieve all links associated with a user
const getAllLinks = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    // Calculate skip value based on pagination parameters
    const skip = (page - 1) * pageSize;

    // Extracting userId from request parameters
    const userId = req.params.userId;

    // Finding the user by ID and populating its 'links' field
    const user = await userModel.findById(userId);

    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const links = await linkModel
      .find({ userId: userId })
      .skip(skip)
      .limit(pageSize);

    // Get the total number of links associated with the user
    const totalDataCount = await linkModel.countDocuments({ userId: userId });
    
    // Calculate endIndex 
    const endIndex = skip + links.length;
    // If the current page is the last page, set the 'lastPage' flag to true
    const lastPage = endIndex >= totalDataCount;
    // Responding with all links associated with the user
    res.json({ links, totalDataCount, lastPage, user });
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a single link
const deleteLink = async (req, res) => {
  try {
    // Extracting userId and linkId from request parameters
    const userId = req.params.userId;
    const linkId = req.params.linkId;

    // Finding the user by ID
    const user = await userModel.findById(userId);
    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deleting the link from the linkModel
    const deletedLink = await linkModel.findByIdAndDelete(linkId);
    // If link not found, respond with 404 status and message
    if (!deletedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Responding with success message
    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete all links associated with a user
const deleteAllLinks = async (req, res) => {
  try {
    // Extracting userId from request parameters
    const userId = req.params.userId;

    // Finding the user by ID
    const user = await userModel.findById(userId);
    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deleting all links associated with the user from the linkModel
    await linkModel.deleteMany({ userId: userId });

    // Responding with success message
    res.status(200).json({ message: "All links deleted successfully" });
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to edit a single link
const editLink = async (req, res) => {
  try {
    // Extracting userId and linkId from request parameters
    const userId = req.params.userId;
    const linkId = req.params.linkId;

    // Finding the user by ID
    const user = await userModel.findById(userId);
    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Updating the link details
    const { name, link, desc, tags } = req.body;
    const updatedLink = await linkModel.findByIdAndUpdate(
      linkId,
      { name, link, desc, tags },
      { new: true }
    );

    // If link not found, respond with 404 status and message
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Responding with success message and updated link
    res
      .status(200)
      .json({ message: "Link updated successfully", link: updatedLink });
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Exporting all controller functions for use in other modules
module.exports = {
  createNewLink,
  getLink,
  getAllLinks,
  deleteLink,
  deleteAllLinks,
  editLink,
};
