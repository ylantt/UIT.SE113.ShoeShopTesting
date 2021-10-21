const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {User} = require("./userModel");
const {Product} = require("./productModel")
const schema = mongoose.Schema;

const transactionSchema = new schema({
    _id: {type: Number},
    status: { type: Boolean},
    paymentType: {type: String},
    deliveryType: {type: Number}, //1. Standard, 2.....
    product:[{
        info: {type: schema.ObjectId, ref: 'Product', required: true},
        qty: {type: Number}
    }],
    total: { type: Number},
    user: { type: schema.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now() },
}, {_id: false});


transactionSchema.plugin(AutoIncrement);

transactionSchema.pre('find', function() {
    try {
        this.populate('user');
        this.populate('product.info');
    } catch (err) {console.log(err)}
})

transactionSchema.pre('findOne', function() {
    try {
        this.populate('product.info');
    } catch (err) {console.log(err)}
})

transactionSchema.pre('remove', async function(next) {
    try {
        const user = await User.findById(this.user).exec();
        user.transaction.pull(this._id);
        await user.save();
    } catch (error) {
        console.log(error)
    }
    next();
})

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = { Transaction };