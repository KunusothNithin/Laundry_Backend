const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            clothType: {type: String, required: true},
            quantity: {type: Number, required: true},
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Placed','Processing','Completed','Delivered'],
        default: 'Placed',
    },
    createdAt: {
        type: Date,
        default:Date.now,
    },
});

module.exports = mongoose.model('Order',orderSchema);
