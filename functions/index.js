const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.GeoTest = functions.https.onRequest((request, response) =>{
    // parse request 
    // request should contian source and destination address
    let url = 'https://maps.googleapis.com/maps/api/geocode/json'
    let apikey = functions.config().location.key

    try{
        response.send(functions.config().location.fakeclientid);
    } catch (err){
        functions.logger.info(err);
    }
})