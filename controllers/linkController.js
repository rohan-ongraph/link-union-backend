const userModel = require("../models/user");
const linkModel = require("../models/link");

const createNewLink = async (req, res) => {
    try {
      const userId = req.params.userId;
      // Check if the user exists
      let user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create a new link
      const { name, link, desc, tags } = req.body;
      const newLink = new linkModel({ name, link, desc, tags });
      await newLink.save();
  
      // Add the new link to the user's links array
      user.links.push(newLink._id);
      await user.save();
  
      res
        .status(201)
        .json({ message: "Link created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  const getLink = async (req, res) => {
    try {
      const linkId = req.params.linkId;
      // Check if the user exists
      const link = await linkModel.findById(linkId);
      if (!link) {
        return res.status(404).json({ message: "link not found" });
      }
  
      res.json(link);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

const getAllLinks = async (req, res) => {
    try {
      const userId = req.params.userId;
      // Check if the user exists
      const user = await userModel.findById(userId).populate("links");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user.links);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  const deleteLink = async (req, res) => {
    try {
      const userId = req.params.userId;
      const linkId = req.params.linkId;

      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the link ID from the user's links array
      user.links.pull(linkId);
      await user.save();

      // Delete the link from the linkModel
      const deletedLink = await linkModel.findByIdAndDelete(linkId);
      if (!deletedLink) {
        return res.status(404).json({ message: "Link not found" });
      }

      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  const deleteAllLinks = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Delete all links associated with the user from the linkModel
      await linkModel.deleteMany({ _id: { $in: user.links } });
      
      // Clear the user's links array
      user.links = [];
      await user.save();
  
      res.status(200).json({ message: "All links deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  const editLink = async (req, res) => {
    try {
      const userId = req.params.userId;
      const linkId = req.params.linkId;
  
      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the link belongs to the user
      if (!user.links.includes(linkId)) {
        return res.status(404).json({ message: "Link not found for the user" });
      }
  
      // Update the link details
      const { name, link, desc, tags } = req.body;
      const updatedLink = await linkModel.findByIdAndUpdate(
        linkId,
        { name, link, desc, tags },
        { new: true }
      );
  
      if (!updatedLink) {
        return res.status(404).json({ message: "Link not found" });
      }
  
      res
        .status(200)
        .json({ message: "Link updated successfully", link: updatedLink });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  module.exports = {
    createNewLink,
    getLink,
    getAllLinks,
    deleteLink,
    deleteAllLinks,
    editLink
  }