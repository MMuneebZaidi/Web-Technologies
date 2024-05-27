const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
});
let user = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = user;