const admin = require('firebase-admin');

module.exports = {
  ...require("./storeImage"),
  ...require("./admin"),
  ...require("./deleteImage"),
  ...require("./ratePark"),
  ...require("./search"),
  ...require("./deleteCollection")
};