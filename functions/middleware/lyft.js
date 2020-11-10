const axios = require("axios");

exports.getLyftPrices = async ({ functions, params, responseBody }) => {
  const lyftEndpoint = functions.config().getprices.lyft_endpoint;
  const lyftParams = {
    params: {
      start_lat: params.startingLatitude,
      start_lng: params.startingLongitude,
      end_lat: params.endLatitude,
      end_lng: params.endLongitude,
    },
  };
  const lyftConfigHeader = { headers: { Host: "www.lyft.com" } };

  return await axios
    .get(lyftEndpoint, lyftParams, lyftConfigHeader)
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
      return Promise.resolve({
        status: 200,
        message: responseBody,
      });
    })
    .catch((err) => {
      if (err.response.status === 400) {
        return Promise.resolve({
          status: 400,
          message: "Lyft: Improper Parameters Set",
        });
      } else {
        return Promise.reject(new Error(`Lyft: ${err.response.data}`));
      }
    });
};
