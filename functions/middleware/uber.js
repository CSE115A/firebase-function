const axios = require("axios");

exports.getUberPrices = async ({ functions, params, responseBody }) => {
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

  return await axios
    .post(uberEndpoint, uberParams, uberConfigHeaders)
    .then((res) => {
      const data = res.data.data.prices;
      if (data === undefined) {
        return Promise.resolve({
          status: 400,
          message: "Uber: Missing or Invalid Params",
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
      return Promise.resolve;
    })
    .catch((err) => {
      return response.status(500).send({
        error: true,
        status: 500,
        message: `Uber: ${err.response.data}`,
      });
    });
};
