const functions = require("firebase-functions");
const { getLyftPrices } = require("./middleware/lyft");
const { getUberPrices } = require("./middleware/uber");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  const params = {
    startingLatitude: request.query.start_lat,
    startingLongitude: request.query.start_lng,
    endLatitude: request.query.end_lat,
    // endLongitude: request.query.end_lng,
  };
  const responseBody = {};
  const lyftResponse = await getLyftPrices({
    functions,
    response,
    params,
    responseBody,
  });

  if (lyftResponse !== undefined) return;

  await getUberPrices({
    functions,
    response,
    params,
    responseBody,
  });
});
