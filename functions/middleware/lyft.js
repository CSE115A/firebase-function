const axios = require("axios");

exports.getLyftPrices = async ({
  functions,
  response,
  params,
  responseBody,
}) => {
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

  await axios
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
      return;
    })
    .catch((err) => {
      if (err.response.status === 400) {
        return response.status(400).send({
          error: true,
          status: 400,
          message: "Params for Lyft are missing or are incorrect!",
        });
      } else {
        return response.status(500).send({
          error: true,
          status: 500,
          message: err.response.data,
        });
      }
    });
};
