const functions = require("firebase-functions");
const admin = require('firebase-admin');
var gcs = admin.storage();

exports.deleteImage = functions.firestore.document('skateparks/{skateparkId}')
    .onDelete(async snapshot => {
        const parkName = snapshot.data();
        // old way
        // const imagePath = parkName.d.name;
        const id = snapshot.id;
        
        const bucket = gcs.bucket("");
        return bucket.deleteFiles({
            prefix: `skatepark/${id}`
        });
    })
