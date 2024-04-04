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

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
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
      secure: true, 
      sameSite: 'None', // Set SameSite to None
      path: "/",
    };

    // Set token in a cookie
    res.cookie("token", token, cookieOptions); // Store the token in an HTTP-only cookie

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

async function googleStrategy(_, _, _, profile, done) {
  try {
    // Find or create a user based on the email retrieved from Google profile
    let user = await userModel.findOne({ email: profile.email });

    if (!user) {
      // If the user does not exist, create a new user using the Google email
      const newUser = new userModel({
        email: profile.email,
        fullname: profile.displayName,
      });
      user = await newUser.save();
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

    // Set token as a cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'None', // Set SameSite to None if using cross-site requests
      path: '/', // Set the cookie path
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expiration time
    };
    res.cookie('token', token, cookieOptions);

    done(null, token); // Pass the token to the done callback
  } catch (error) {
    done(error); // Pass any errors to the done callback
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleStrategy
};
