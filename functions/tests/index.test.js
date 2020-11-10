const { getPrices } = require("../index");
const mockConfig = require("firebase-functions-test")();
const { request, response } = require("./constants");
const { getLyftPrices } = require("../middleware/lyft");
const { getUberPrices } = require("../middleware/uber");
jest.mock("../middleware/lyft");
jest.mock("../middleware/uber");

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getPrices Testing Suite", () => {
  beforeEach(() => {
    response.status().send({ undefined });
  });
  describe("when given incomplete params", () => {
    getLyftPrices.mockImplementationOnce(() =>
      Promise.reject({
        response: { status: 400, message: new Error("Params are missing") },
      }),
    );
    it("should return 400 bad request error message", async () => {
      request.query = {
        start_lat: 123,
        start_lng: 123,
      };
      await getPrices(request, response);
      expect(response.body.status).toEqual(400);
    });
  });
  it("passed", () => {
    expect(2 + 2).toEqual(4);
  });
});
