// Importing required modules
const express = require("express"); // Importing Express.js framework
const { setConnection } = require("./connection"); // Importing function for setting up database connection
const router = require("./routes/auth"); // Importing authentication router
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const cors = require("cors"); // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const dotenv = require('dotenv'); // Module for loading environment variables from a .env file
const userRouter = require("./routes/users"); // Importing router for user-related routes
const linkRouter = require("./routes/links"); // Importing router for link-related routes
dotenv.config(); // Loading environment variables from .env file

// const passport = require('./passport-config'); // Importing passport configuration for authentication

// Retrieving MongoDB cluster URL from environment variables
const url = process.env.MONGO_DB_CLUSTER_URL;

// Creating an Express application
const app = express();

// Defining the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Establishing connection to MongoDB
setConnection(url);

// Initializing passport for authentication
// app.use(passport.initialize());

// Middleware setup
app.use(cors()); // Enabling CORS for all routes
app.use(express.urlencoded({ extended: false })); // Middleware for parsing URL-encoded request bodies
app.use(express.json()); // Middleware for parsing JSON request bodies
app.use(cookieParser()); // Middleware for parsing cookies

// Routes setup
app.use("/", router); // Mounting authentication router at the root path
app.use("/users", userRouter); // Mounting user-related routes under '/users' path
app.use("/user", linkRouter); // Mounting link-related routes under '/user' path

// Starting the server and listening on specified port
app.listen(PORT, () => {
  console.log(`Server started at PORT -> ${PORT}`);
});