const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.ratePark = functions.https.onCall((data, context) => {
    const collection = admin.firestore().collection("skateparks");
    const document = collection.doc(data.parkID);
    const rating = data.rating;
    const user = data.user;
    const newRatingDocument = document.collection("ratings").doc();
    return admin.firestore().runTransaction(transaction => {
        return transaction.get(document).then(doc => {
            const data = doc.data();
            const newAverage =
                (data.d.numRatings * data.d.rating + rating) /
                (data.d.numRatings + 1);
            transaction.set(document, {
                d: {
                    numRatings: data.d.numRatings + 1,
                    rating: newAverage,
                }
            }, { merge: true });
            return transaction.set(newRatingDocument, { rating: rating, user: user });
        });
    });
})