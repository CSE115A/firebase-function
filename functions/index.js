const functions = require("firebase-functions");
const axios = require("axios");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  const startingLatitude = request.query.start_lat;
  const startingLongitude = request.query.start_lng;
  const endLatitude = request.query.end_lat;
  const endLongitude = request.query.end_lng;

  const lyftEndpoint = functions.config().getprices.lyft_endpoint;
  const lyftConfigHeader = { headers: { Host: "www.lyft.com" } };
  const responseBody = {};
  const lyftResponse = await axios
    .get(
      lyftEndpoint,
      {
        params: {
          start_lat: startingLatitude,
          start_lng: startingLongitude,
          end_lat: endLatitude,
          end_lng: endLongitude,
        },
      },
      lyftConfigHeader
    )
    .then((res) => {
      responseBody.lyft = [];
      const costEstimates = res.data.cost_estimates;
      for (cost in costEstimates) {
        let item = costEstimates[cost];
        let dataToInput = {
          displayName: item.display_name,
          price: `$${item.estimated_cost_cents_min / 100}-${
            item.estimated_cost_cents_max / 100
          }`,
        };
        responseBody.lyft.push(dataToInput);
      }
      return;
    })
    .catch(() => {
      return response.status(400).send({
        error: true,
        status: 400,
        message: "Params for Lyft are missing or are incorrect!",
      });
    });

  if (lyftResponse !== undefined) return;

  const uberEndpoint = functions.config().getprices.uber_endpoint;
  const uberParams = {
    destination: {
      latitude: parseFloat(endLatitude),
      locale: "en",
      longitude: parseFloat(endLongitude),
      provider: "google_places",
    },
    locale: "en",
    origin: {
      latitude: parseFloat(startingLatitude),
      locale: "en",
      longitude: parseFloat(startingLongitude),
      provider: "google_places",
    },
  };
  const uberConfigHeaders = {
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": "x",
    },
    params: { localeCode: "en" },
  };
  await axios
    .post(uberEndpoint, uberParams, uberConfigHeaders)
    .then((res) => {
      const data = res.data.data.prices;
      responseBody.uber = [];
      for (item in data) {
        let dataToInput = {
          displayName: data[item].vehicleViewDisplayName,
          price: data[item].fareString,
        };
        responseBody.uber.push(dataToInput);
      }
      return response
        .status(200)
        .send({ error: false, status: 200, body: responseBody });
    })
    .catch(() => {
      return response.status(400).send({
        error: true,
        status: 400,
        message: "Error has occured with Uber",
      });
    });
});
