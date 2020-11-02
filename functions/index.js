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
      responseBody.lyft = res.data.cost_estimates;
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
          id: "ChIJRzZDuPyZhYARNKAbWkxPFV0",
          latitude: 37.9742222,
          locale: "en",
          longitude: -122.5329032,
          provider: "google_places",
        },
        locale: "en",
        origin: {
          id: "ChIJd7nCu5qXhYARXBNwEAX-ILE",
          latitude: 38.0067935,
          locale: "en",
          longitude: -122.5496167,
          provider: "google_places",
        },
      },
      uberConfigHeaders
    )
    .then((res) => {
      responseBody.uber = res.data.data.prices;
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
