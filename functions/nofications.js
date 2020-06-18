const functions = require("firebase-functions");
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const GeoFirestore = require('geofirestore').GeoFirestore;
const db = admin.firestore();

const workers = {
    helloWorld: (notificationToken) => SendMessage(notificationToken)
}

// const getTheParks = async (radius, token) => {
//     const lat = -27.6506467;
//     const long = 153.1579264;

//     const firestore = admin.firestore();
//     const geofirestore = new GeoFirestore(firestore);
//     const geocollection = geofirestore.collection("skateparks");

//     let query = await geocollection.limit(50).near({
//         center: new firestore.GeoPoint(lat, long),
//         radius
//     });

//     let docQuery = await query.onSnapshot(snapshot => {
//         let parks = [];

//         for (let i = 0; i < snapshot.docs.length; i++) {
//             let { doc } = snapshot.docChanges()[i];
//             let park = {
//                 ...snapshot.docs[i].data(),
//                 distance: doc.distance,
//                 id: snapshot.docs[i].id
//             };
//             parks.push(park);
//         }

//         const sortedParks = parks.sort(function (a, b) {
//             return a.distance - b.distance;
//         });
//         sortedParks.forEach(i => {
//             SendMessage(token, i.name, i.distance.toFixed(2));
//         });
//     });
// }

const SendMessage = async (token) => {
    const message = {
        to: token,
        sound: 'default',
        title: "hey dude",
        body: "nothing to see",
        data: { data: 'goes here' },
        android: {
            channelId: "test"
        },
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
};



exports.taskRunner = functions.runWith({ memory: '2GB' }).pubsub

    .schedule('* * * * *').onRun(async context => {

        // Query all documents ready to perform
        const query = db.collection('users').where('enabled', '==', true)

        const tasks = await query.get();

        // Jobs to execute concurrently. 
        const jobs = [];

        // Loop over documents and push job.
        tasks.forEach(snapshot => {
            const { worker, notificationToken } = snapshot.data();
            const job = workers[worker](notificationToken)
                // Update doc with status on success or error
                .then(() => snapshot.ref.update({ status: 'complete' }))
                .catch((err) => snapshot.ref.update({ status: 'error' }));

            jobs.push(job);
        });

        // Execute all jobs concurrently
        return await Promise.all(jobs);

    });