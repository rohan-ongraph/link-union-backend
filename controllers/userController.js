// Acquiring the necessary models for user, link, and contact data
const userModel = require("../models/user");
const linkModel = require("../models/link");
const contactModel = require("../models/contact");

// Function to retrieve a user by their ID
const getUserById = async function (req, res) {
  try {
    // Extracting userId from request parameters
    const userId = req.params.userId;
    
    // Finding the user by their ID and populating their 'links' field
    const user = await userModel.findById(userId).populate("links");
    
    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Responding with the user data
    res.json(user);
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a user and all associated links
const deleteUserAndAssociatedLinks = async function (req, res) {
  try {
    // Extracting userId from request parameters
    const userId = req.params.userId;

    // Find the user by their ID
    const user = await userModel.findById(userId);
    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all links associated with the user from the linkModel
    await linkModel.deleteMany({ _id: { $in: user.links } });

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    // Responding with success message
    res
      .status(200)
      .json({ message: "User and associated links deleted successfully" });
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to handle contact form submissions
const contactUs = async function (req, res) {
  try {
    // Extracting userId from request parameters
    const userId = req.params.userId;
    
    // Check if the user exists
    let user = await userModel.findById(userId);
    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new contact form entry
    const { subject, description } = req.body;
    const newContactForm = new contactModel({
      subject,
      description,
      userId: userId, // Assign the userId to the new contact form
    });
    await newContactForm.save();

    // Responding with success message and the created contact form
    res
      .status(201)
      .json({
        message: "Contact form submitted successfully",
        contactForm: newContactForm,
      });
  } catch (error) {
    // Handling any internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Exporting the controller functions for use in other modules
module.exports = {
  getUserById,
  deleteUserAndAssociatedLinks,
  contactUs,
};
