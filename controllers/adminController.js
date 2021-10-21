const {Product} = require("../models/productModel")
const {Category} = require("../models/categoryModel")
const {Transaction} = require("../models/transactionModel")
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
const {User} = require("../models/userModel");
const { Router } = require('express');
const { mongo } = require('mongoose');
exports.getDashboard = async (req, res, next) => {
  try {
    // Render template
    const products =  await Product.find();
    const users = await User.find();
    const orders = await Transaction.find();
    return res.status(200).render("admin/pages/dashboard", {
      title: "Dashboard",product: products, user: users, orders: orders,
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

// categories
exports.getCategories = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("admin/pages/category/category", {
      title: "Categories",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

// orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Transaction.find();
    const shipped = [];
    const shipping = [];
    for(i =0; i < orders.length; i++){
      if(orders[i].status == true ){
        shipped.push(orders[i])
      }
      if(orders[i].status == false){
        shipping.push(orders[i])
      }
    }
    // Render template
    return res.status(200).render("admin/pages/order/order", {
      title: "Orders", 
      orders: orders,
      shipped: shipped,
      shipping: shipping
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

// products
exports.getProducts = async (req, res, next) => {
  try {
    // Render template
    const status = req.query.status;
    const products =  await Product.find();
    const sales = [];
    const isNew = [];
    for(i =0; i < products.length; i++){
      if(products[i].sale > 0){
        sales.push(products[i])
      }
      if(products[i].condition == true){
        isNew.push(products[i])
      }
    }
    return res.status(200).render("admin/pages/product/product", {
      title: "Products", 
      product: products, 
      status: status,
      sales: sales,
      isNew: isNew
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getAddProduct = async (req, res, next) => {
  try {
    const category = await Category.find();
    // Render template
    return res.status(200).render("admin/pages/product/product-add", {
      title: "Add Product",
      category: category,
      searchOptions: req.query,
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getEditProduct = async (req, res, next) => {
  try {
    //get product for edit
    const product = await Product.findById(req.params.id);
    const desc = product.detail.split('\r\n')
    const category = await Category.find();
    // Render template
    return res.status(200).render("admin/pages/product/product-edit", {
      title: "Edit Product",
      product: product,
      desc: desc,
      category: category
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

// users
exports.getUsers = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("admin/pages/user/user", {
      title: "Users",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

exports.getAddUser = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("admin/pages/user/user-add", {
      title: "Add User",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

// Feedbacks
exports.getFeedbacks = async (req, res, next) => {
  try {
    // Render template
    return res.status(200).render("admin/pages/feedback", {
      title: "Add User",
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: err });
  }

  next();
};

//Product POST
//add
exports.postAddProduct = async (req,res,next) => {  
  const product = new Product({
    name: req.body.productName,
    description: req.body.productShortDesc,
    detail: req.body.productDesc,
    price: req.body.productPrice,
    category: [req.body.productCate],
    sale: req.body.pSaleOff,
    condition: req.body.pIsNew,
    quantity: req.body.quantity,
    shoeSize: req.body.cshoeSize,
  });
  console.log("req.body Ok");
  const coverImgObject = saveImage(req.body.coverImage);
  product.coverImage.data = coverImgObject["data"];
  product.coverImage.type = coverImgObject["type"];
  console.log("coverimage Ok");
  if (req.body.images.length) {
    const imageArr = [];
    req.body.images.forEach(img => {
      let objImg = {};
      const transferedImd = saveImage(img);

      objImg.data = transferedImd["data"];
      objImg.type = transferedImd["type"];

      imageArr.push(objImg);
      
    });

    product.images = imageArr;
  }
  console.log("image Ok");
  try {
    const newProduct = await product.save();
    console.log("add ok");
    return res.redirect("/admin/products?status=Success");
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/products?status=Fail")
  }

  next();
}

//Update
exports.putUpdateProduct = async(req,res,next) => {
  let product

  try {
    product = await Product.findById(req.params.id);
    product.name = req.body.productName,
    product.description = req.body.productShortDesc;
    product.detail = req.body.productDesc;
    product.category = [req.body.productCate];
    product.sale = req.body.pSaleOff;
    product.condition = req.body.pIsNew;
    product.quantity = req.body.quantity;
    product.price = req.body.productPrice;
    const image = saveImage(req.body.coverImage)
    const newImage = Product()
    newImage.coverImage.data = image["data"];
    newImage.coverImage.type = image["type"];
    product.coverImage = newImage.coverImage;
    await product.save()
    return res.redirect("/admin/products?status=Success");
  } catch (err) {
    console.log(err)
    return res.redirect("/admin/products?status=Fail")
  }
}

function saveImage(img) {
  if (img == null) return;
  const image = JSON.parse(img);
  if (image != null && imageMimeTypes.includes(image.type)) return {
    data: new Buffer.from(image.data,'base64'),
    type: image.type
  }
}
//Admin delete

exports.delete = async (req, res) => {
  let product
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
    return res.redirect("/admin/products?status=Success");
  } catch {
    return res.redirect("/admin/products?status=Fail");
  }
};

exports.deleteOrder = async (req,res) => {
  let order
  try {
    order = await Transaction.findById(req.params.id);
    await order.remove();
    return res.send("success");
  } catch (error) {
    return res.send(error);
  }
}

exports.patchOrder = async (req,res) => {
  let order
  try {
    order = await Transaction.findById(req.params.id,"status");
    order.status = !order.status;
    await order.save()
    return res.send("success");
  } catch (error) {
    return res.send(error);
  }
}

