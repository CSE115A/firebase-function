const functions = require("firebase-functions");
const axios = require("axios");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  const lyftEndpoint = "https://www.lyft.com/api/costs";
  const configHeaders = { headers: { Host: "www.lyft.com" } };
  return await axios
    .get(
      lyftEndpoint,
      {
        params: {
          start_lat: 38.0067935,
          start_lng: -122.5496167,
          end_lat: 37.9742222,
          end_lng: -122.5329032,
        },
      },
      configHeaders
    )
    .then((res) => {
      return response.status(200).send({
        error: false,
        status: 200,
        price_estimates: res.data.cost_estimates,
      });
    })
    .catch((err) => {
      return response.send(err);
    });
});
