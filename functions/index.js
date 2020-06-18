const admin = require('firebase-admin');

admin.initializeApp()
const Storage = require('@google-cloud/storage');
const gcs = new Storage.Storage();

module.exports = {
  ...require("./storeImage"),
  ...require("./admin")
  // ...require("./deleteImage"),
  // ...require("./nofications")
  // ...require("./image-crop"),
  // ...require("./search")
};
