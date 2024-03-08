const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema({
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    email: {type: String, required: true},
    mob: {type: String, required: true},
    dob: {type: String, required: true},
    address: {type: String, required: true},
    education1: {type: String, required: true},
    college: {type: String, required: true},
    startYear: {type: String, required: true},
    endYear: {type: String, required: true},
    skills: {type: String, required: true},
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Resume', resumeSchema);