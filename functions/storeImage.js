const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require("cors")({ origin: true });
const fs = require("fs-extra");
const UUID = require("uuid-v4");

const Storage = require('@google-cloud/storage');
const gcs = new Storage.Storage();

exports.storeImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const body = JSON.parse(request.body);
        fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
            console.log(err);
            return response.status(500).json({ error: err });
        });
        const bucket = gcs.bucket("bucket");
        const uuid = UUID();
        const name = body.name;

        bucket.upload(
            "/tmp/uploaded-image.jpg",
            {
                uploadType: "media",
                destination: `skatepark/${name}/` + name + uuid + '.jpg',
                metadata: {
                    metadata: {
                        contentType: "image/jpeg",
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            },
            (err, file) => {
                if (!err) {
                    response.status(201).json({
                        imageUrl:
                            "https://firebasestorage.googleapis.com/v0/b/" +
                            bucket.name +
                            "/o/" +
                            encodeURIComponent(file.name) +
                            "?alt=media&token=" +
                            uuid,
                        imagePath: `/skatepark/${name}/` + name + uuid + ".jpg"
                    });
                } else {
                    console.log(err);
                    response.status(500).json({ error: err });
                }
            }
        );
    });
});