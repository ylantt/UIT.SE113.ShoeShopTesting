const { Product } = require("../models/productModel");
const { Transaction } = require("../models/transactionModel");
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");
const { Feedback } = require("../models/feedbackModel");
const { Contact } = require("../models/contactModel");

const { User } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const dotenv = require("dotenv");
const mail = require("../models/mailModel");
dotenv.config({ path: "./config.env" });
const countryStateCity = require('country-state-city');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripeSecretKey);

exports.addToCart = async (req, res, next) => {
  try {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

    await Product.findById(productId, function (err, p) {
      if (err) {
        return res.status(404).json({ status: "fail", message: err });
      }

      cart.add(p, productId);
      req.session.cart = cart;
      req.session.save();
    });
    return res.send(cart);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.removeFromCart = async (req, res, next) => {
  try {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart);

    await Product.findById(productId, function (err, p) {
      if (err) {
        return res.status(404).json({ status: "fail", message: err });
      }

      cart.remove(p, productId);
      req.session.cart = cart;

      if (req.session.cart.totalQty == 0) {
        req.session.cart = undefined;
      }

      req.session.save();
    });
    return res.send(req.session.cart);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.updateCart = async (req, res, next) => {
  try {
    var productId = req.params.id;
    var newQty = req.body.newQty;

    var cart = new Cart(req.session.cart);

    await Product.findById(productId, function (err, p) {
      if (err) {
        return res.status(404).json({ status: "fail", message: err });
      }

      cart.updateQty(p, productId, newQty);
      req.session.cart = cart;
      req.session.save();
    });
    return res.send(req.session.cart);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.addToWishlist = async (req, res, next) => {
  try {
    var productId = req.params.id;
    var wishlist = new Wishlist(
      req.session.wishlist ? req.session.wishlist : { items: {} }
    );

    await Product.findById(productId, function (err, p) {
      if (err) {
        return res.status(404).json({ status: "fail", message: err });
      }

      wishlist.add(p, productId);
      req.session.wishlist = wishlist;
      req.session.save();
    });
    return res.send(req.session.wishlist);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    var productId = req.params.id;
    var wishlist = new Wishlist(req.session.wishlist);

    await Product.findById(productId, function (err, p) {
      if (err) {
        return res.status(404).json({ status: "fail", message: err });
      }

      wishlist.remove(productId);
      req.session.wishlist = wishlist;
      req.session.save();
    });
    return res.send(req.session.wishlist);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.register = async (req, res) => {
  const { fullname, username, email, phone, password, pwdrepeat } = req.body;
  let errors = [];

  //Check required fields
  if (!fullname || !username || !email || !phone || !password || !pwdrepeat) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check password match
  if (password != pwdrepeat) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check pass length (should be at least 8 characters long)
  if (password.length < 8 && password.length > 0) {
    errors.push({ msg: "Passwords should be at least 8 characters" });
  }
  // Check phone length
  if (phone.length > 10) {
    errors.push({ msg: "Phone number allows maximumu 10 numbers in length" });
  }
  if (errors.length > 0) {
    //Validation pass
    return res.render("pages/signUp", {
      title: "Sign Up",
      errors,
      fullname,
      username,
      email,
      phone,
      password,
      pwdrepeat,
    });
    // console.log(errors);
  } else {
    // Validation pass
    User.findOne({
      $or: [{ email: email }, { userName: username }],
    }).then((user) => {
      if (user) {
        // Users exists
        errors.push({ msg: "Duplicate email or username, please try again" });
        return res.render("pages/signUp", {
          title: "Sign Up",
          errors,
          fullname,
          username,
          email,
          phone,
          password,
          pwdrepeat,
        });
        //console.log(errors);
      } else {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 7; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        const link = "http://localhost:8080/client/api/verify/" + result

        var verify = {
          fullName: fullname,
          userName: username,
          email: email,
          phone: phone,
          password: password,
          verifyCode: result
        }

        var html = "<p>Access this link to complete sign up:</p>";
        html += '<a href="' + link + '">' + link + '</a>'
        mail.confirmationMail(email, "Verify your account", html)
        req.session.verify = verify
        req.session.save()
        return res.redirect('/verify')
      }
    });
  }
};

exports.verified = async (req, res) => {
  const id = req.params.id;
  if (id != req.session.verify.verifyCode) return res.redirect("/permissiondenied")
  const user = req.session.verify
  var newUser = new User({
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    phone: user.phone,
    password: user.password
  });

  // Hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(User => {
          req.flash('success_msg', 'Registered successfully, you can log in now');
          req.session.verify = null;
          return res.redirect('/signIn');
        })
        .catch((err) => console.log(err));
    });
  });
}

exports.login = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    // successRedirect: '/',
    // failureRedirect: '/signIn',
    // failureFlash: true
    req.session.user = user;
    req.session.save();
    // console.log(req.session.user);
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error_msg', 'Incorrect username/email or password, please try again');
      return res.redirect('/signIn');
    } else {
      if (req.session.user.role == 1) return res.redirect("/admin");
      else return res.redirect("/");
    }
    // req.logIn(user, function(err) {
    //   if (err) { return next(err); }
    //     return res.redirect('/users/' + user.username);
    // });
  })(req, res, next);
};
exports.removeCart = async (req, res, next) => {
  req.session.cart = undefined;
  return res.send(req.session.cart);
};

exports.sendOTP = async (req, res) => {
  const name = req.body.name;
  const user = await User.findOne(name.includes("@") ? { email: name } : { userName: name }).exec();
  if (!user) {
    req.flash('error_msg', 'Incorrect username/email, please try again');
    return res.json(false)
  }
  const otp = Math.floor(100000 + Math.random() * 900000)
  req.session.email = user.email;
  req.session.otp = otp;
  req.session.save();
  var html = "<p>Here's your otp: " + otp + "</p> <br>";
  html += "Use your otp to reset password" + "<br>"
  html += "If you did not forget password and received this mail, BE CAUTION with any fraudulent activity" + "<br>"
  mail.confirmationMail(user.email, "Your OTP", html);
  return res.json(true);
}

exports.validate = async (req, res) => {
  const input = req.body.otp;
  const otp = req.session.otp;
  if (input == otp) return res.json(true);
  req.flash('error_msg', "Incorrect OTP, please try again");
  return res.json(false);
}

exports.newPass = async (req, res) => {
  const newPass = req.body.newPass;
  const confirmPass = req.body.confirmPass;
  if (newPass != confirmPass) {
    req.flash('error_msg', "Passwords do not match");
    return res.json(false);
  }
  const email = req.session.email;
  const user = await User.findOne({ email: email }).exec();
  bcrypt.compare(newPass, user.password, (err, isMatch) => {
    if (isMatch) {
      req.flash('error_msg', "Please enter a different password");
      return res.json(false);
    }
  })
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPass, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then(function () {
          req.flash('success_msg', 'Password changed successfully, you can log in now');
          return res.json(true);
        })
        .catch(err => console.log(err));
    });
  });
}

exports.postPaymentDone = async (req, res) => {
  var type = req.body.type
  let total = 0
  let cart = req.body.cart
  let product = []
  const user = await User.findOne({ email: req.body.user.email });
  user.address = req.body.user.address;
  req.session.user = user;
  req.session.save();
  for (i = 0; i < cart.length; i++) {
    const item = await Product.findById(cart[i].id)
    item.quantity -= cart[i].qty;
    item.sold += cart[i].qty;
    total = total + item.price * 100 * cart[i].qty
    product.push({
      info: item._id,
      qty: cart[i].qty
    })
    await item.save();
  }
  if (type == "card") {
    await stripe.charges
      .create({
        amount: total,
        source: req.body.token,
        currency: "usd",
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).end();
      });
  }
  try {
    const trans = new Transaction({
      total: total,
      paymentType: type,
      product: product,
      user: user._id,
      status: false
    })
    const newTrans = await trans.save()
    user.transaction.push(newTrans._id);
    await user.save();
    console.log('Charge Successful');
    var html = "Here's your order id: " + newTrans._id + "<br>"
    html += "For any further information, do not hesitate to contact us via " + "<br>"
    html += "Facebook: https://www.facebook.com/sneakercityy or through chatbox \n" + "<br>"
    html += "Your order will be prepare in 3 to 5 working days and will be shipped immediately\n" + "<br>"
    html += "Total time for you order will be from 5 - 10 day working estimatedly \n";
    mail.confirmationMail(user.email, "Your order", html);
    return res.json({ message: 'Successfully purchased items\nYour order number: ' + newTrans._id })
  } catch (err) {
    console.log(err)
    return res.status(500).end()
  }

}

exports.autoSearchComplete = async (req, res) => {
  try {
    var regex = new RegExp(req.query["term"], "i");

    var productFilter = await Product.find({ name: regex }, { 'name': 1 }).limit(5);

    var result = [];

    if (productFilter && productFilter.length && productFilter.length > 0) {
      productFilter.forEach(product => {
        result.push(product.name);
      })
    }

    res.json(result);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.getStatesOfCountry = async (req, res) => {
  try {
    const countryCode = req.body.countryCode;

    const states =
      countryStateCity.State.getAllStates()
        .filter(state => state["countryCode"] == countryCode)
        .map(state =>
          new Object({
            "isoCode": state["isoCode"],
            "name": state["name"]
          }));

    return res.send(states);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.getCitiesOfState = async (req, res) => {
  try {
    const countryCode = req.body.countryCode;
    const stateCode = req.body.stateCode;

    const cities = countryStateCity.City.getAllCities()
      .filter(
        city => city["countryCode"] == countryCode
          && city["stateCode"] == stateCode
      )
      .map(city =>
        new Object({
          "name": city["name"]
        }));

    return res.send(cities);
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.addFeedback = async (req, res) => {
  const { username, feedback, slug, starNumber, time } = req.body;
  var newFeedback = new Feedback({
    username,
    feedback,
    slug,
    starNumber,
    time
  });
  var fb = await newFeedback.save();
  res.json(
    fb
  )
}

exports.sendContact = async (req, res, next) => {
  try {
    const { fullName, email, message } = req.body;
  
    const newContact = new Contact({
      fullName: fullName,
      email: email,
      message: message
    });

    await newContact.save();

    return res.status(200).send("ok");
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
};