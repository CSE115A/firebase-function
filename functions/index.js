const functions = require("firebase-functions");
const { getLyftPrices } = require("./middleware/lyft");
const { getUberPrices } = require("./middleware/uber");
const { authenticateToken } = require("./middleware/middleware");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  response.set({ "Access-Control-Allow-Origin": "*" });
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Headers", "authentication");
    return response.status(200).send("");
  } else {
    const { isAuthError, authStatusCode, authMessage } = authenticateToken(
      functions,
      request,
    );
    if (isAuthError) {
      return response.status(authStatusCode).send({
        error: true,
        status: authStatusCode,
        message: authMessage,
      });
    }
    const params = {
      startingLatitude: request.query.start_lat,
      startingLongitude: request.query.start_lng,
      endLatitude: request.query.end_lat,
      endLongitude: request.query.end_lng,
    };
    let responseBody = {};
    const lyftResponse = await getLyftPrices({ functions, params })
      .then((res) => {
        if (res.status === 400) {
          return response.status(400).send({
            error: true,
            status: 400,
            message: res.message,
          });
        }
        responseBody.lyft = res.message;
        return false;
      })
      .catch((err) => {
        return response.status(500).send({
          error: true,
          status: 500,
          message: err.message,
        });
      });
    if (lyftResponse) return response;

    const token = request.headers.authentication;
    const uberResponse = await getUberPrices({ functions, params, token })
      .then((res) => {
        if (res.status === 400) {
          return response.status(400).send({
            error: true,
            status: 400,
            message: res.message,
          });
        }
        responseBody.uber = res.message;
        return false;
      })
      .catch((err) => {
        return response.status(500).send({
          error: true,
          status: 500,
          message: err.message,
        });
      });

    if (uberResponse) return response;

    response.status(200).send({
      error: false,
      status: 200,
      message: responseBody,
    });
    return response;
  }
});
