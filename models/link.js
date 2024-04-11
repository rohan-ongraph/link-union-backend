const { Schema, model } = require("mongoose");

const linkSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
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