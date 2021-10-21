var mongoose = require('mongoose');
const {Product} = require('../models/productModel');
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");
const {User} = require("../models/userModel");
const {Transaction} = require("../models/transactionModel");
const dotenv = require("dotenv");
const {Feedback} = require("../models/feedbackModel");
const APIFeatures = require("../utils/apiFeatures");
dotenv.config({ path: "./config.env" });
const countryStateCity = require('country-state-city');


const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY


const {Category} = require("../models/categoryModel");
exports.getHome = async (req, res, next) => {
  try {
    // Render template
    const products = await (await Product.find().sort({createdDate: -1})).slice(0, 8);
    return res.status(200).render("pages/home", { title: "Home", products: products});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getAbout = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/about", { title: "About" });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getContact = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/contact", { title: "Contact" });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getFeedback = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/feedback", {
      title: "Feedback",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

// get products
exports.getProducts = async (req, res, next) => {
  try {
    let filter = {}

    // get info for sending data to view
    brand = req.params.brand || null;
    condition = req.params.condition || null;

    // get brand name
    if (brand) {
      filter = { "category.0.name": brand }
    }

    if (condition) {
      filter = {"products.condition": true}
    }

    const limit = 9; // limit products on each page
  
    const page = req.query.page * 1 || 1; // convert string to number

    let queryString = "";
    for (const [key, value] of Object.entries(req.query)) {
      if (key == "page") {
        continue;
      }
      queryString += key + "=" + value + "&";
    }

    const numProducts = await Product.countDocuments(filter); // total number of products

    // execute query
    const features = new APIFeatures(Product.find(filter), req.query)
    .filter()
    .sort()
    .paginate(limit);
    
    const products = await features.query;

    // Render template
    return res.status(200).render("pages/products", {
      title: brand || "Products", 
      products: products,
      current: page,
      pages: Math.ceil(numProducts / limit),
      queryString: queryString
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};


exports.getProduct = async (req, res, next) => {
  try {
    // Render template
    const slug = req.params.slug;
    const feedbacks = await Feedback.find({slug: slug}).exec();
    const product = await Product.findOne({slug: slug}).exec();

    const cateName = product.category[0].name;
    const relatedProduct = await Product.find({"category.0.name": cateName}).limit(4).exec();

    return res.status(200).render("pages/detail", {
      title: "Detail", 
      product: product,
      products: relatedProduct,
      feedbacks, slug
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getPolicy = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/return-policy", {
      title: "Policy",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getShoeSizePage = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/findShoeSize.ejs", {
      title: "Policy",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getAccount = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/account", {
      title: "Account",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getWishlist = async (req, res, next) => {
  try {
    if (!req.session.wishlist) {
      return res.status(200).render("pages/wishlist", {
          title: "Wishlist",   
          products: null
        }
      );
    }

    var wishlistSession = new Wishlist(req.session.wishlist);
    var wishlist = wishlistSession.generateArr()
    let products = []
    for (i = 0; i < wishlist.length; i++) {
      const product = await Product.findOne({name: wishlist[i].item.name}).exec();
      products.push(product)
    }
    return res.status(200).render("pages/wishlist", {
      title: "Wishlist",
      products: products,
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getCart = async (req, res, next) => {
  try {
    if (!req.session.cart) {
      return res.status(200).render("pages/cart", {
          title: "Cart",   
          products: null
        }
      );
    }

    var cartSession = new Cart(req.session.cart);
    var cart = cartSession.generateArr();
    let products = []
    for (i = 0; i < cart.length; i++) {
      const product = await Product.findOne({name: cart[i].item.name}).exec();
      products.push({
        info: product,
        qty: cart[i].qty
      })
    }
    return res.status(200).render("pages/cart", {
        title: "Cart",   
        products: products,
        totalPrice: cartSession.totalPrice,
      }
    );
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getPayment = async (req, res, next) => {
  try {
    if (!req.session.cart.totalQty) {
      return res.redirect('/home');
    }

    var cart = new Cart(req.session.cart);
    //const user = await User.findOne({userName: req.session.user.userName}).exec()

    const countries = 
    countryStateCity.Country.getAllCountries()
    .map(country => 
      new Object({
      "isoCode": country["isoCode"], 
      "name": country["name"]
    }));

    return res.status(200).render("pages/payment", {
      title: "Checkout",
      total:  cart.totalPrice,
      products: cart.generateArr(),
      //user: user,
      stripePublicKey: stripePublicKey,
      countries: countries
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getVerify = (req,res) => {
  try {
    if (typeof req.session.verify == "undefined") return res.redirect("/permissiondenied")
    const email = req.session.verify.email;
    const verifyCode = req.session.verify.verifyCode;
    return res.status(200).render("pages/verify-account",{
      title: "Verify",
      email: email,
      verifyCode: verifyCode
    })    
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.getLoginFirst = async(req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/login-first", { title: "Log In first"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
  next();
}

exports.getPermissionDenied = async(req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/permission-denied", { title: "No permission"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
  next();
}

exports.getSignIn = async (req, res, next) => {
  try {
    
    // Render template
    return res.status(200).render("pages/signIn", { title: "Sign In"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getForgotPass = async (req, res) => {
  try {
    // Render template
    return res.status(200).render("pages/forgotPassword", { title: "Forgot Password"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.getValidate = async (req,res) =>{
  try {
    // Render template
    return res.status(200).render("pages/validateUser", { title: "Validate User"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.getNewPass = async (req,res) => {
  try {
    // Render template
    return res.status(200).render("pages/newPassword", { title: "New Password"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }
}

exports.getSignUp = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("pages/signUp", { title: "Sign Up"});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.logout = (req, res) => {
  req.logout();
  req.session.user = null;
  return res.redirect('back'); // redirect ve trang hien tai
}

exports.getOrder = async (req, res, next) => {
  try {
    // Render template
    const user = req.session.user;
    var orders = [];
    if (user.transaction.length <= 0 || typeof user.transaction[0] != 'number') orders = null;
    else {
      const transactions = user.transaction;
      for (i = 0; i < transactions.length; i++) {
        orders.push(await Transaction.findOne({_id: transactions[i]}).exec());
      }
    }
    return res.status(200).render("pages/clientOrder", { title: "Order", orders: orders});
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
}

exports.getOrderDetail = async (req,res,next) => {
  try {
    const order = await Transaction.findOne({_id: req.params.id}).exec();
    return res.status(200).render("pages/order-detail", {title: "Order | Detail", order: order});
  } catch (error) {
    return res.status(404).json({  status:"fail", message: err });
  }
}