const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: null,
        required: true,
    },
    email: {
        type: String,
        default: null,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("user", userSchema);