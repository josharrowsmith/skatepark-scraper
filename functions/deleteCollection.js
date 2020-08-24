const admin = require('firebase-admin');
const firebase_tools = require('firebase-tools');
const functions = require('firebase-functions');
const project = "";
const token = functions.config().ci_token;

exports.deleteCollection = functions.runWith({ timeoutSeconds: 540 })
    .https.onCall((data, context) => {

        const id = data.id;
        const path = `skateparks/${id}`

        if (context.auth.token.admin !== true) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Hey, that is not cool buddy!'
            );
        }

        return firebase_tools.firestore
            .delete(path, {
                project,
                token,
                recursive: true,
                yes: true,
            })
            .then(() => ({ result: 'all done!' }));
    });
