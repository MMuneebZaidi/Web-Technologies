const mongoose = require("mongoose");
let profileSchema = mongoose.Schema({
    id: String,
    userId: String,
    name: String,
    email: String,
    phone: String,
    instagram: String,
    linkedIn: String,
    twitter: String,
    jobTitle: String,
    companyId: String,
    leads: String,
});
let Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;