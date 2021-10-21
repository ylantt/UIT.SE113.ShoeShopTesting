const mongoose = require("mongoose");
const schema = mongoose.Schema;

const contactSchema = new schema({
    fullName: String,
    email: { type: String, required: [true, 'Contact must have user email'] },
    message: { type: String, required: [true, 'Contact must have message'] },
    createdDate: { type: Date, default: Date.now() }
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = { Contact };
