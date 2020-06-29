const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verifyCodeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true }
);

const Verify = mongoose.model("Verify", verifyCodeSchema);

module.exports = { Verify };
