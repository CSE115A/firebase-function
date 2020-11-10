/* eslint-disable prefer-promise-reject-errors */
const axios = require("axios");
jest.mock("axios");
const { getUberPrices } = require("../middleware/uber");
const mockConfig = require("firebase-functions-test")();
const { functions, params } = require("./constants");

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getUberPrices Testing Suite", () => {
  describe("when given incorrect params", () => {
    const incorrectResponse = {
      data: { data: {} },
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(incorrectResponse));
    it("returns a 400 error with appropriate fields", async () => {
      const response = await getUberPrices({ functions, params });
      expect(response.status).toEqual(400);
      expect(response.message).toBe("Uber: Missing or Invalid Params");
    });
  });

  describe("when given correct params", () => {
    const correctResponse = {
      data: {
        data: {
          prices: [{ vehicleViewDisplayName: "Uber", fareString: "$10-12" }],
        },
      },
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(correctResponse));
    it("returns appropriate 200 response", async () => {
      const response = await getUberPrices({ functions, params });
      expect(response.status).toEqual(200);
      expect(response.message).toStrictEqual([
        { displayName: "Uber", price: "$10-12" },
      ]);
    });
  });

  describe("when tokens are incorrectly set", () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({
        response: { data: "Missing csrf token" },
      }),
    );
    it("returns a 500 error with correctly set fields", async () => {
      return expect(
        getUberPrices({
          functions,
          params,
        }),
      ).rejects.toThrow("Missing csrf token");
    });
  });
});
