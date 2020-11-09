const axios = require("axios");
const { getPrices } = require("../index");
const mockConfig = require("firebase-functions-test")();

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "https://www.uber.com/api/loadFEEstimates",
    lyft_endpoint: "https://www.lyft.com/api/costs",
  },
});
jest.mock("axios");
describe("getPrices Testing Suite", () => {
  it("passed", () => {
    expect(2 + 2).toEqual(4);
  });
});
