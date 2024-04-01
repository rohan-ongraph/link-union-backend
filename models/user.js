const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'link'
    }]
});

const userModel = model('user', userSchema);

module.exports = userModel;