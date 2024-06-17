const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    problemTitle: {
        type: String,
        required: true,
    },
    language: { 
        type: String,
        required: true,
    },
    submissionTime: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

module.exports = mongoose.model("submission", submissionSchema);
