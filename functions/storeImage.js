const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const fs = require("fs-extra");
const UUID = require("uuid-v4");
var admin = require("firebase-admin");
var serviceAccount = require("");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: ""
});

var gcs = admin.storage();
exports.storeImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const body = JSON.parse(request.body);
        fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
            console.log(err);
            return response.status(500).json({ error: err });
        });
        const bucket = gcs.bucket();
        const uuid = UUID();
        const name = body.name;
        const id = body.id;

        bucket.upload(
            "/tmp/uploaded-image.jpg",
            {
                uploadType: "media",
                destination: `skatepark/${id}/` + id + uuid + '.jpg',
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
                            bucket.id +
                            "/o/" +
                            encodeURIComponent(file.name) +
                            "?alt=media&token=" +
                            uuid,
                        imagePath: `/skatepark/${id}/` + id + uuid + ".jpg"
                    });
                } else {
                    console.log(err);
                    response.status(500).json({ error: err });
                }
            }
        );
    });
});