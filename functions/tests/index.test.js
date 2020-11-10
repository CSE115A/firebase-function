// const { getPrices } = require("../index");
const mockConfig = require("firebase-functions-test")();

mockConfig.mockConfig({
  getprices: {
    uber_endpoint: "www.test.com",
    lyft_endpoint: "www.test1.com",
  },
});

describe("getPrices Testing Suite", () => {
  it("passed", () => {
    expect(2 + 2).toEqual(4);
  });
});
