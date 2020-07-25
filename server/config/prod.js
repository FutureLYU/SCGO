const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  mongoURI: process.env.MONGO_URI,
  emailuser: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
};
