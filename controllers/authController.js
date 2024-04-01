const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Acquiring the models
const userModel = require("../models/user");

const registerUser = async (req, res) => {
  try {
    // Extract user details from request body
    const { fullname, email, password } = req.body;

    // Check if user with the provided email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    // Create a new user instance
    const newUser = new userModel({
      fullname,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();
    // console.log(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // Extract user credentials from request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = bcrypt.compare(password, user.password); // Await the bcrypt comparison
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        fullname: user.fullname,
      },
      process.env.TOKEN_SECRET_KEY
    );

    const cookieOptions = {
      httpOnly: true,
      secure: false, 
      domain: "localhost", 
      path: "/",
    };

    // Set token in a cookie
    res.cookie("token", token, cookieOptions); // Store the token in an HTTP-only cookie

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
