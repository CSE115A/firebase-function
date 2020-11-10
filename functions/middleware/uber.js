const axios = require("axios");

exports.getUberPrices = async ({
  functions,
  response,
  params,
  responseBody,
}) => {
  const uberEndpoint = functions.config().getprices.uber_endpoint;
  const uberParams = {
    destination: {
      latitude: parseFloat(params.endLatitude),
      locale: "en",
      longitude: parseFloat(params.endLongitude),
      provider: "google_places",
    },
    locale: "en",
    origin: {
      latitude: parseFloat(params.startingLatitude),
      locale: "en",
      longitude: parseFloat(params.startingLongitude),
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
      if (data === undefined) {
        return response.status(400).send({
          error: true,
          status: 400,
          message: "Invalid Uber Params!",
        });
      }
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
        .send({ error: false, status: 200, message: responseBody });
    })
    .catch((err) => {
      return response.status(500).send({
        error: true,
        status: 500,
        message: `Uber: ${err.response.data}`,
      });
    });
};
