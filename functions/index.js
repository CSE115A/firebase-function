const functions = require("firebase-functions");
const axios = require("axios");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  const lyftEndpoint = functions.config().getprices.lyft_endpoint;
  const lyftConfigHeader = { headers: { Host: "www.lyft.com" } };
  const responseBody = {};
  const lyftResponse = await axios
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
  const uberConfigHeaders = {
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": "91f17a77-f8a6-46f9-a5a5-8be7ad3f7c2c",
    },
    params: { localeCode: "en" },
  };

  await axios
    .post(
      uberEndpoint,
      {
        destination: {
          latitude: 37.9742222,
          longitude: -122.5329032,
        },
        locale: "en",
        origin: {
          latitude: 38.0067935,
          longitude: -122.5496167,
        },
      },
      uberConfigHeaders
    )
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
