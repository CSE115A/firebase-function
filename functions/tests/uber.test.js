const axios = require("axios");
jest.mock("axios");
const { getUberPrices } = require("../middleware/uber");
const mockConfig = require("firebase-functions-test")();
const { functions, response, params, responseBody } = require("./constants");

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getUberPrices Testing Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
  });

  describe("when given incorrect params", () => {
    const incorrectResponse = {
      data: { data: {} },
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(incorrectResponse));
    it("returns a 400 error with appropriate fields", async () => {
      await getUberPrices({ functions, response, params, responseBody });
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toBe("Invalid Uber Params!");
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
      responseBody["lyft"] = [
        {
          displayName: "Lyft",
          price: "$10-12",
        },
      ];
      const expectedResponseBody = {
        lyft: [
          {
            displayName: "Lyft",
            price: "$10-12",
          },
        ],
        uber: [
          {
            displayName: "Uber",
            price: "$10-12",
          },
        ],
      };
      await getUberPrices({ functions, response, params, responseBody });
      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.status).toEqual(200);
      expect(response.body.message).toEqual(expectedResponseBody);
    });
  });

  describe("when tokens are incorrectly set", () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({
        response: { data: "Missing csrf token" },
      }),
    );
    it("returns a 500 error with correctly set fields", async () => {
      await getUberPrices({ functions, response, params, responseBody });
      expect(response.statusCode).toEqual(500);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(500);
      expect(response.body.message).toBe("Uber: Missing csrf token");
    });
  });
});
