const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    fname:{
        type: String,
        required: true
    },

    lname:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    phone:{
        type: String,
        required: true
    },

    address:{
        type: String,
        required: true
    },

    residentCity:{
        type: String,
        required: true
    },

    dateRegistered: {
        type: Date,
        default: Date.now()
    }
});

module.exports = new mongoose.model('Customer', customerSchema);