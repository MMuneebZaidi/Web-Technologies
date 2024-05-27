const mongoose = require("mongoose");
let companySchema = mongoose.Schema({
    id: String,
    userId: String,
    profileId: String,
    name: String,
    email: String,
    phone: String,
    instagram: String,
    linkedIn: String,
    twitter: String,
    industry: String,
});
let company =  mongoose.model("Company", companySchema);
module.exports = company;