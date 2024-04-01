const mongoose = require("mongoose")

async function setConnection(url){
    mongoose.connect(url).then(()=> console.log("Connection Establised")).catch((err) => console.log("Error", err));
}

module.exports = {
    setConnection
}