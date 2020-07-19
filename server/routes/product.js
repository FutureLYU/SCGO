const express = require("express");
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require("multer");
const sharp = require("sharp");

const { auth } = require("../middleware/auth");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb("Type File is not allowed", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("file");
const uploadImages = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    next();
  });
};

const resizeImages = async (req, res, next) => {
  // console.log(req.file)
  if (!req.file) return next();

  const newFilename = `${Date.now()}_${req.file.originalname}`;
  await sharp(req.file.buffer)
    .resize({ width: 752 })
    .jpeg({ quality: 90 })
    .toFile(`uploads/${newFilename}`)
    .then((info) => (req.body.height = info.height));
  req.body.images = `uploads/${newFilename}`;
  next();
};

//=================================
//             Product
//=================================

router.post("/uploadImage", auth, uploadImages, resizeImages, (req, res) => {
  if (!req.body.images) {
    return res.json({ success: false, err: "Upload failed" });
  }
  return res.json({
    success: true,
    image: req.body.images,
    height: req.body.height,
  });
});

router.post("/uploadProduct", auth, (req, res) => {
  // save all the data we got from the client into the DB
  const products = req.body.map((item) => new Product(item));

  Product.insertMany(products, (err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/updateProduct", auth, (req, res) => {
  // save new product into the DB
  const product = req.body;

  Product.findOneAndUpdate(
    { _id: product._id },
    product,
    (err) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true })
    }
  )
});

router.post("/getProducts", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  let term = req.body.searchTerm;
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      findArgs[key] = req.body.filters[key];
    }
  }

  // console.log(findArgs)

  if (term) {
    Product.find(findArgs)
      .find({ title: { $regex: term } })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  } else {
    Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  }
});

//?id=${productId}&type=single
//id=12121212,121212,1212121   type=array
router.get("/products_by_id", (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;

  // console.log("req.query.id", req.query.id)

  if (type === "array") {
    let ids = req.query.id.split(",");
    productIds = [];
    productIds = ids.map((item) => {
      return item;
    });
  }

  // console.log("productIds", productIds)

  //we need to find the product information that belong to product Id
  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

router.post("/getByUser", (req, res) => {
  let id = req.body.userid;
  Product.find({ writer: id }).exec((err, products) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, products });
  });
});

module.exports = router;
