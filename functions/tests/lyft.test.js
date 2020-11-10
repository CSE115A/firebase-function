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

const response = {
  status: (status) => {
    response.statusCode = status;
    return response;
  },
  send: ({ error, status, message }) => {
    response.body = {
      error: error,
      status: status,
      message: message,
    };
    return response;
  },
};

const params = {
  startingLatitude: 123,
  startingLongitude: 123,
  endLongitude: 123,
  endLatitude: 123,
};

const responseBody = {};

describe("getLyfPrices Testing Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
  });
  describe("when given incorrect params", () => {
    axios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: { status: 400, message: new Error("Params are missing") },
      }),
    );

    it("returns 400 status code with error message", async () => {
      const params = {
        startingLongitude: 123,
        endLongitude: 123,
        endLatitude: 123,
      };

      await getLyftPrices({ functions, response, params, responseBody });

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toBe(
        "Params for Lyft are missing or are incorrect!",
      );
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
      await getLyftPrices({
        functions,
        response,
        params,
        responseBody,
      });

      expect(responseBody).toEqual({
        lyft: [{ displayName: "Lyft", price: "$10-12" }],
      });
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
      await getLyftPrices({ functions, response, params, responseBody });
      expect(response.statusCode).toEqual(500);
      expect(response.body.error).toBeTruthy();
      expect(response.body.status).toEqual(500);
      expect(response.body.message).toBe(
        "Server Side Error. Please try again later",
      );
    });
  });
});
