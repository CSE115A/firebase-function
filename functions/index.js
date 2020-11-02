const functions = require("firebase-functions");
const axios = require("axios");

exports.getPrices = functions.https.onRequest(async (request, response) => {
  const lyftEndpoint = "https://www.lyft.com/api/costs";
  const lyftConfigHeader = { headers: { Host: "www.lyft.com" } };
  const responseBody = {};
  await axios
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

  const uberEndpoint = "https://www.uber.com/api/loadFEEstimates";
  const uberConfigHeaders = {
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": "x",
    },
    params: { localeCode: "en" },
  };
  await axios
    .post(
      uberEndpoint,
      {
        destination: {
          latitude: 37.9742222,
          locale: "en",
          longitude: -122.5329032,
          provider: "google_places",
        },
        locale: "en",
        origin: {
          latitude: 38.0067935,
          locale: "en",
          longitude: -122.5496167,
          provider: "google_places",
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
      return;
    })
    .catch(() => {
      return response
        .status(400)
        .send({ error: true, status: 400, message: "Error has occured" });
    });
  return response
    .status(200)
    .send({ error: false, status: 200, body: responseBody });
});
