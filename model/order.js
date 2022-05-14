const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    orderDate: {
        type: Date,
        default: Date.now()
    },

    product:{
        type: String,
        required: true
    },

    quantity:{
        type: Number,
        required: true
    },

    merchant:{
        type: String,
        required: true
    },

    delivery_address:{
        type: String,
        required: true
    },

})