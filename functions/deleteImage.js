const functions = require("firebase-functions");
const admin = require('firebase-admin');

const Storage = require('@google-cloud/storage');
const gcs = new Storage.Storage();

exports.deleteImage = functions.database
    .ref("/skatepark/{skateparkId}")
    .onDelete(event => {
        const placeData = snapshot.val();
        const imagePath = placeData.imagePath;

        const bucket = gcs.bucket("bucket");
        return bucket.file(imagePath).delete();
    });
