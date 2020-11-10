/* eslint-disable prefer-promise-reject-errors */
const axios = require("axios");
jest.mock("axios");
const { getLyftPrices } = require("../middleware/lyft");
const mockConfig = require("firebase-functions-test")();
const { functions, responseBody, params } = require("./constants");

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getLyfPrices Testing Suite", () => {
  describe("when given incorrect params", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 400,
          message: "Params are missing",
        },
      }),
    );

    it("returns 400 status code with error message", async () => {
      const params = {};

      const response = await getLyftPrices({
        functions,
        params,
        responseBody,
      });

      expect(response.status).toEqual(400);
      expect(response.message).toBe("Lyft: Improper Parameters Set");
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
      const response = await getLyftPrices({ functions, params });

      expect(response.message).toEqual([
        { displayName: "Lyft", price: "$10-12" },
      ]);
      expect(response.status).toEqual(200);
    });
  });

  describe("when unknown error happens server side", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 500,
          data: "Server Side Error. Please try again later",
        },
      }),
    );
    it("correctly displays 500 error message", async () => {
      return expect(
        getLyftPrices({ functions, params, responseBody }),
      ).rejects.toThrow("Server Side Error. Please try again later");
    });
  });
});
