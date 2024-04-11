// Acquiring the necessary models for user, link, and contact data
const userModel = require("../models/user");
const linkModel = require("../models/link");
const contactModel = require("../models/contact");
const nodemailer = require("nodemailer");

const getUserById = async function (req, res) {
  try {
    // Extracting userId from request parameters
    const userId = req.params.userId;

    // Finding the user by their ID
    const user = await userModel.findById(userId);

    // If user not found, respond with 404 status and message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Finding the links associated with the user
    const userLinks = await linkModel.find({ userId: userId });

    // Responding with the user data
    res.json({ user: user, links: userLinks });

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
    await linkModel.deleteMany({ userId: userId });

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


// Function to submit contact form
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

    // Extract user's email from the user model (assuming it's stored during signup)
    const userEmailAddress = user.email;

    // Create a transporter with your email service credentials
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSKEY,
      },
    });

    // Define email content
    let mailOptions = {
      from: process.env.EMAIL, // Set the sender as the user's email
      to: userEmailAddress, // Set your email as the recipient
      subject: "Form submitted successfully",
      html: `
                <p><b> ${user.fullname.toUpperCase()}</b> contact form was submitted successfully with content:</p><br>
                <div style="background-color: #f2f2f2; padding: 10px; font-style: italic;">
                    <p style="font-weight: bold;">SUBJECT: ${subject}</p>
                    <p>MESSAGE: ${description}</p>
                </div><br>
                <p>Thank you for your feedback</p>
            `,
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully");
      }
    });

    // Responding with success message and the created contact form
    res.status(201).json({
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
