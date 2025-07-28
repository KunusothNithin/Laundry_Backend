const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    image: {
        type: String,
        default: ""
    },
    createdAt: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('User',userSchema);

module.exports = User;