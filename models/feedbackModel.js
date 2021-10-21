const mongoose = require("mongoose");
const schema = mongoose.Schema;

const feedbackSchema = new schema({
    // feedback: { type: String, required: [true, 'Feedback must have message'] },
    // starNumber:{ type: Number, min: 1, max: 5 }, 
    // isAccept: { type: Boolean},
    // // user: { type: schema.ObjectId, ref: 'User', required: [true, 'Feedback must belong to a user.'] },
    // user: {type: String},
    // product: { type: schema.ObjectId, ref: 'Product', required: [true, 'Feedback must belong to a product.'] },
    // createdDate: { type: Date, default: Date.now() },
    feedback: { type: String, maxlength: 100 },//required: true 
    // starNumber:{ type: Number, min: 1, max: 5 }, 
    slug: String,
    time: String,
    starNumber:{ type: Number, min: 1, max: 5 }, 
    // isAccept: { type: Boolean},
    username: { type: String},//type: Schema.ObjectId, ref: 'User', required: true , required: true 
    // product: { type: Schema.ObjectId, ref: 'Product', required: true },
    // createdDate: { type: Date, default: Date.now() },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = { Feedback };

