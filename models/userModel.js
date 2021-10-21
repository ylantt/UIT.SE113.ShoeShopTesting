const mongoose = require("mongoose");
const validator = require('validator');
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  image: { type: Array, default: [] },
  fullName: String,
  userName: {
    type: String,
    required: [true, 'User must have username'],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'User must have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please a provide a valid email'],
  },
  address: { 
    detail: {type: String, required: false, default: ""},
    city: {type: String, required: false, default: ""},
    state: {type: String, required: false, default: ""},
    country: {type: String, required: false, default: ""},
  },
  phone: { type: String, maxlength: [10, 'Phone number must have equal or less than 8 characters'] },
  password: {
    type: String,
    required: true,
    minlength: [8, 'The password must have greater than 8 characters'],
    select: true,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, "Please confirm your password"],
  //   validate: {
  //     // this only works on CREATE and SAVE, this is point to new document => not for update
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     message: "Passwords are not the same!",
  //   },
  // },
  role: { type: Number, default: 0 }, // 0: client, 1: admin
  createdDate: { type: Date, default: Date.now() },
  avatarImage: {
    type: Object,
    default: {
      data: { type: Buffer },
      type: { type: String },
    },
  },
  transaction: {
    type: Array,
    default: [{type: schema.ObjectId, ref: 'Transaction', required: false}]
  }
});

userSchema.virtual("avatarImagePath").get(function () {
  if (this.avatarImage.data != null && this.avatarImage.type != null)
    return `data:${this.avatarImage.type};charset:utf-8;base64,${this.avatarImage.data.toString(
      "base64"
    )}`;
});

userSchema.virtual("fullAddress").get(function() {
  return this.address.detail + ", " + this.address.city + ", " + this.address.state + ", " + this.address.country; 
})

// userSchema.pre("find", function() {
//   try {
//     this.populate("transaction");
//   } catch (err) {
//     console.log(err);
//   }
// })


const User = mongoose.model("User", userSchema);
module.exports = {User};
//module.exports = User = mongoose.model('User', userSchema)

// module.exports.insertUser = function(newClient, callback){
//   bcrypt.genSalt(10, function(err, salt){
//     bcrypt.hash(newClient.password, salt, function(err, hash){
//       newUser.password = hash;
//       newClient.save(callback);
//     });
//   });
// }

// module.exports.getUserByID = function(id, callback){
//   User.findById(id, callback);
// }

// module.exports.getUserByUsername = function(username, callback){
//   var query = {username: username};
//   User.findOne(query, callback);
// }

// module.exports.comparePassword = function(candidatePass, hash, callback ){
//   bcrypt.compare(candidatePass, hash, function(err, isMatch){
//     callback(null, isMatch);
//   });
// }