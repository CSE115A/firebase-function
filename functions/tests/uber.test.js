const axios = require("axios");
jest.mock("axios");
const { getUberPrices } = require("../middleware/uber");
