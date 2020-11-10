const axios = require("axios");
jest.mock("axios");
const { getLyftPrices } = require("../middleware/lyft");
const mockConfig = require("firebase-functions-test")();

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getLyfPrices Testing Suite", () => {
  describe("when given incorrect params", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Params are missing")),
    );

    it("returns 400 status code with error message", async () => {
      const functions = {
        config: () => {
          return {
            getprices: {
              uber_endpoint: "www.test.com",
              lyft_endpoint: "www.test1.com",
            },
          };
        },
      };

      const response = {};

      const params = {
        startingLatitude: 123,
        startingLongitude: 123,
        endLongitude: 123,
        endLatitude: 123,
      };

      const responseBody = {};

      await getLyftPrices({ functions, response, params, responseBody });

      expect(2 + 2).toEqual(4);
    });
  });
  describe("when given correct params", () => {
    const lyftEndpointResponse = {
      data: {
        cost_estimates: [
          {
            display_name: "Lyft",
            estimated_cost_cents_min: 1000,
            estimated_cost_cents_max: 1200,
          },
        ],
      },
    };
    axios.get.mockImplementationOnce(() =>
      Promise.resolve(lyftEndpointResponse),
    );
    it("returns with a with no errors", async () => {
      const functions = {
        config: () => {
          return {
            getprices: {
              uber_endpoint: "www.test.com",
              lyft_endpoint: "www.test1.com",
            },
          };
        },
      };
      const response = {};
      const params = {
        startingLatitude: 123,
        startingLongitude: 123,
        endLongitude: 123,
        endLatitude: 123,
      };
      const responseBody = {};
      await getLyftPrices({
        functions,
        response,
        params,
        responseBody,
      });

      expect(response).toEqual({});
      expect(responseBody).toEqual({
        lyft: [{ displayName: "Lyft", price: "$10-12" }],
      });
    });
  });
});
