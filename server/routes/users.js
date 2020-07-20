const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Verify } = require("../models/Verify");
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");
const email = require("../middleware/send.js");
const async = require("async");
mongoose.set("useFindAndModify", false);

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 1 ? true : false,
    isAuth: true,
    email: req.user.email,
    username: req.user.name,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
    state: req.user.state,
  });
});

router.post("/register", (req, res) => {
  if (req.body.verifyId === "initialId") {
    return res.json({
      success: false,
      err: { errmsg: "please get verification code" },
    });
  }
  userData = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    image: req.body.image,
  };
  newObjId = mongoose.Types.ObjectId(req.body.verifyId);
  VerifyData = {
    VerifyCode: req.body.verifyCode,
    VerifyId: newObjId,
  };

  Verify.findOne({ _id: VerifyData.VerifyId }, (err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      if (doc.code === VerifyData.VerifyCode) {
        const user = new User(userData);
        user.save((err, doc) => {
          if (err) return res.json({ success: false, err });
          return res.status(200).json({
            success: true,
          });
        });
      } else {
        return res.json({
          success: false,
          err: { errmsg: "Wrong Verification Code" },
        });
      }
    }
  });
});

router.post("/changepassword", (req, res) => {
  if (req.body.verifyId === "initialId") {
    return res.json({
      success: false,
      err: { message: "please get verification code" },
    });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        success: false,
        err: { message: "account does not exist" },
      });
    } else {
      Verify.findById(req.body.verifyId, (err, doc) => {
        if (err) return res.json({ success: false, err });
        else {
          if (doc.code === req.body.verifyCode) {
            user.password = req.body.password;
            user.markModified("password");
            user.save((err, pw) => {
              if (err) return res.json({ success: false, err });
              else return res.status(200).json({ success: true });
            });
          } else {
            return res.json({
              success: false,
              err: { message: "Wrong Verification Code" },
            });
          }
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.get("/addToCart", auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let duplicate = false;

    // console.log(userInfo)

    userInfo.cart.forEach((item) => {
      if (item.id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, "cart.id": req.query.productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.query.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    }
  });
});

router.get("/removeFromCart", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { cart: { id: req.query._id } },
    },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map((item) => {
        return item.id;
      });

      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, cartDetail) => {
          return res.status(200).json({
            cartDetail,
            cart,
          });
        });
    }
  );
});

router.get("/userCartInfo", auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let cart = userInfo.cart;
    let array = cart.map((item) => {
      return item.id;
    });

    Product.find({ _id: { $in: array } })
      .populate("writer")
      .exec((err, cartDetail) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({ success: true, cartDetail, cart });
      });
  });
});

router.post("/deleteProduct", auth, (req, res) => {
  const item = req.body;
  let history = [];
  const getDateOfDelete = () => {
    date = new Date();

    let Y = date.getFullYear() + "-";
    let M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    let D = date.getDate() + " ";
    let h = date.getHours() + ":";
    let m = date.getMinutes() + ":";
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
  };

  history.push({
    dateOfDelete: getDateOfDelete(),
    title: item.title,
    id: item._id,
    price: item.price,
    reason: item.reason,
  });

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history } },
    { new: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      Product.findOneAndDelete({ _id: item._id }, (err) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
          success: true,
          history: user.history,
        });
      });
    }
  );
});

router.get("/getHistory", auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let history = doc.history;
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, history });
  });
});

// generate verification code and send to user's email | example : "3817"
router.post("/sendEmail", (req, res) => {
  const code = String(Math.floor(Math.random() * (9999 - 1000)) + 1000);
  const verify = new Verify({ email: req.body.email, code: code });
  const mail = req.body.email;

  verify.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else {
      return email.sendMail(mail, code, (state) => {
        if (state) {
          return res.status(200).json({ success: true, id: verify._id });
        } else {
          return res.send("failed to send email");
        }
      });
    }
  });
});

// get product uploaded
router.get("/getUploadProduct", auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let uploadProduct = doc.upload;
    if (err) return res.status(400).send(err);
    return res.status(200).json({ uploadProduct });
  });
});

// update product uploaded
router.post("/updateUploadProduct", auth, (req, res) => {
  const newUploadProduct = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { upload: newUploadProduct },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

module.exports = router;
