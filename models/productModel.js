const slugify = require('slugify');
const mongoose = require("mongoose");
const {Category}  = require("./categoryModel");
const schema = mongoose.Schema;

const productSchema = schema({
  name: { 
    type: String, 
    required: [true, 'Product must have a name'], 
    unique: true 
  },
  slug: String,
  coverImage: { type: Object, default:
    {
      data: {type: Buffer},
      type: {type: String}
    } },
  images: { type: [Object] },
  description: { type: String, required: [true, 'Product must have a description'] },
  detail: { type: String, required: [true, 'Product must have detail info'] },
  price: { type: Number, default: 0, required: [true, 'Product must have a price'] },
  sale: { 
    type: Number, 
    default: 0,
    min: [0, 'The sale off percentage is greater than 0'],
    max: [100, 'The sale off percentage is equal or less than 100'] 
  },
  condition: { type: Boolean, default: true },
  quantity: { 
    type: Number, 
    default: 1,
    min: [1, 'The quantity must be greater than 1']
  },
  createdDate: { type: Date, default: Date.now() },
  //transaction: { type: Schema.ObjectId, ref: 'Transaction', required: true },
  category: Array,
  shoeSize: { type: [String] },
  sold: {type: Number, default: 0}
});

productSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage.data != null && this.coverImage.type != null)
    return `data:${this.coverImage.type};charset:utf-8;base64,${this.coverImage.data.toString(
      "base64"
    )}`;
});

productSchema.virtual("imagesPath").get(function () {
  let imagesPath = [];
  
  if (this.images.length) {
    this.images.forEach(img => {
      imagesPath.push(`data:${img.type};charset:utf-8;base64,${img.data.toString(
        "base64"
      )}`);
    })
  }

  return imagesPath;
});

productSchema.virtual("priceDiscount").get(function () {
  return this.price*(100 - this.sale)/100;
});

// pre hook save: add product's slug -> runs before the .save() command or .create() command
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// pre hook save: await embedded collections (category)
productSchema.pre('save', async function (next) {
  this.category = await Category.findById(this.category).select('-categoryImage');
  next();
});

// post hook save: increase quntity by 1
productSchema.post('save', function (doc, next) {
  this.quantity++;
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
