const { Schema, model } = require("mongoose");

const linkSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    tags: {
        type: Array
    }
});

const linkModel = model('link', linkSchema);

module.exports = linkModel;