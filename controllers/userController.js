// Acquiring the models
const userModel = require("../models/user");
const linkModel = require("../models/link");
const contactModel = require("../models/contact");

const getUserById = async function (req, res) {
  try {
    const userId = req.params.id;
    // Check if the user exists
    const user = await userModel.findById(userId).populate("links");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    res.json(user);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserAndAssociatedLinks = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all links associated with the user
    await linkModel.deleteMany({ _id: { $in: user.links } });

    // Delete the user
    await user.delete();

    res
      .status(200)
      .json({ message: "User and associated links deleted successfully" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const contactUs = async (req, res) => {
  try {
    const userId = req.params.userId; // Correct parameter name is userId, not id
    // Check if the user exists
    let user = await userModel.findById(userId);
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

    res
      .status(201)
      .json({
        message: "Contact form submitted successfully",
        contactForm: newContactForm,
      });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserById,
  deleteUserAndAssociatedLinks,
  contactUs,
};
