const express = require("express");
const adminController = require("../controllers/adminController");
const {authRole} = require('../public/js/authentication');
const router = express.Router();

router.get("/", authRole, adminController.getDashboard);

router.get("/dashboard", authRole, adminController.getDashboard);

// categories
router.get("/categories", authRole, adminController.getCategories);

// orders
router.get("/orders", authRole, adminController.getOrders);

// products
router.use("/products", authRole, adminController.getProducts);
router.use("/add-product", authRole, adminController.getAddProduct);
router.use("/edit-product/:id", authRole, adminController.getEditProduct);

// users
router.use("/users", authRole, adminController.getUsers);
router.use("/add-user", authRole, adminController.getAddUser);

// feedbacks
router.use("/feedbacks", authRole, adminController.getFeedbacks);

//delete
router.delete("/product/delete/:id", authRole, adminController.delete); 

module.exports = router;
