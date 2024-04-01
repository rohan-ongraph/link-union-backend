const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
});

const ContactForm = mongoose.model('ContactForm', contactFormSchema);

module.exports = ContactForm;
