const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    heights: {
      type: Array,
      default: [],
    },
    places: {
      type: Number,
      default: -1,
    },
    means: {
      type: Number,
      default: 0,
    },
    tag: {
      type: Number,
      default: 0,
    },
    category: {
      type: Number,
      default: 0,
    },
    wechat: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    contactchoice: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weights: {
      name: 5,
      description: 1,
    },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
