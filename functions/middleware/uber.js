const axios = require("axios");

exports.getUberPrices = async ({ functions, params, token }) => {
  const uberEndpoint = functions.config().getprices.uber_endpoint;
  const uberParams = {
    destination: {
      latitude: parseFloat(params.endLatitude),
      longitude: parseFloat(params.endLongitude),
    },
    locale: "en",
    origin: {
      latitude: parseFloat(params.startingLatitude),
      longitude: parseFloat(params.startingLongitude),
    },
  };
  const uberConfigHeaders = {
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": `${token}`,
    },
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
      const uber = [];
      for (item in data) {
        let dataToInput = {
          displayName: data[item].vehicleViewDisplayName,
          price: data[item].fareString,
        };
        uber.push(dataToInput);
      }
      return Promise.resolve({
        status: 200,
        message: uber,
      });
    })
    .catch((err) => {
      return Promise.reject(new Error(`Uber: ${err.response.data}`));
    });
};
