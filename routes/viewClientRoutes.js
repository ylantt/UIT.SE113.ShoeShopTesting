const express = require("express");
const clientController = require("../controllers/clientController");
const chatbotController = require("../controllers/chatbotController");
const router = express.Router();
const {user} = require("../models/userModel");
const {ensureAuthenicated} = require('../public/js/authentication');


router
  .route("/webhook")
  .get(chatbotController.getWebhook);

router
  .route("/webhook")
  .post(chatbotController.postWebhook)


// --- public routes
router.get("/", clientController.getHome);

router.get("/home", clientController.getHome);

// get products
router.get("/products/:brand?", clientController.getProducts);

//là để lấy detail theo slug
router.get("/product/:slug", clientController.getProduct);

router.get("/return-policy", clientController.getPolicy);

router.get("/feedback", clientController.getFeedback);

router.get("/about", clientController.getAbout);

router.get("/contact", clientController.getContact);
router.get("/shoe-size-guide", clientController.getShoeSizePage);
// --- protected routes

router.get("/orders", ensureAuthenicated, clientController.getOrder);

router.get("/orders/view/:id", ensureAuthenicated, clientController.getOrderDetail);

//users
router.get("/account" ,ensureAuthenicated , clientController.getAccount); // dung authenicate

router.get("/wishlist", clientController.getWishlist); 

//Check out
router.get("/cart", clientController.getCart);

router.get("/checkout", ensureAuthenicated, clientController.getPayment);

// Sign in
router.get("/signInFirst", clientController.getLoginFirst);

router.get("/permissiondenied", clientController.getPermissionDenied);

router.get("/signIn", clientController.getSignIn);

router.get("/forgotPassword",clientController.getForgotPass);

router.get("/validate",clientController.getValidate);

router.get("/newPassword",clientController.getNewPass);

router.get("/signUp", clientController.getSignUp);

router.get("/verify",clientController.getVerify)

router.get("/logout", clientController.logout);




module.exports = router;
