const mongoose = require("mongoose");
let profileSchema = mongoose.Schema({
    id: String,
    userId: String,
    name: String,
    username: String,
    email: String,
    phone: String,
    instagram: String,
    linkedIn: String,
    twitter: String,
    jobTitle: String,
    companyId: String,
    leads: String,
    address: String,
    image:
        {
            data: Buffer,
            contentType: String
        },
    cover:
        {
            data: Buffer,
            contentType: String
        }
});

let Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;