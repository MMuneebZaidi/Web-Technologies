const mongoose = require("mongoose");
let leadSchema = mongoose.Schema({
    id: String,
    companyId: String,
    profileId: String,
    name: String,
    email: String,
    phone: String,
    company: String,
});
let lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
module.exports = lead;