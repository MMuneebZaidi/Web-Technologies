const mongoose = require("mongoose");
let contactSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    message: String
});
let contact =  mongoose.model("Contact", contactSchema);
module.exports = contact;