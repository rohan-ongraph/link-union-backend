// Importing Mongoose library for MongoDB object modeling
const mongoose = require("mongoose");

// Function to establish connection with MongoDB database
async function setConnection(url){
    // Connecting to the MongoDB database using the provided URL
    mongoose.connect(url)
        .then(() => console.log("Connection Established")) 
        .catch((err) => console.log("Error", err)); 
}

// Exporting the setConnection function for use in other modules
module.exports = {
    setConnection
}
