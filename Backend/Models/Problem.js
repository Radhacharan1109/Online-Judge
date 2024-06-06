const mongoose = require("mongoose");

const problemschema= new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        unique: true,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    testcases: [
        {
            input: { type: String },
            output: { type: String },
        }
    ]
});

module.exports = mongoose.model("problem",problemschema);