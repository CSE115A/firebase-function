const functions = require("firebase-functions");
const { getLyftPrices } = require("./middleware/lyft");
const { getUberPrices } = require("./middleware/uber");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  const params = {
    startingLatitude: request.query.start_lat,
    startingLongitude: request.query.start_lng,
    endLatitude: request.query.end_lat,
    endLongitude: request.query.end_lng,
  };
  const responseBody = {};
  const lyftResponse = await getLyftPrices({
    functions,
    params,
    responseBody,
  })
    .then((res) => {
      if (res.status === 400) {
        response.status(400).send({
          error: true,
          status: 400,
          message: res.message,
        });
      }
      responseBody.lyft = res.message;
      return;
    })
    .catch((err) => {
      response.status(500).send({
        error: true,
        status: 500,
        message: err.message,
      });
    });

  if (lyftResponse !== undefined) return;

  // await getUberPrices({
  //   functions,
  //   params,
  //   responseBody,
  // });
});
