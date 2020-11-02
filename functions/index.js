const functions = require("firebase-functions");
require("isomorphic-fetch");

exports.getPrices = functions.https.onRequest((request, response) => {
  return fetch("https://www.lyft.com/api/costs")
    .then((res) => response.status(200).send(res.message))
    .catch((error) => response.status(500).send(error.message));
});
