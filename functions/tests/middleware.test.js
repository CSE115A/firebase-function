const { authenticateToken } = require("../middleware/middleware");
const { functions, request } = require("./constants");
const mockConfig = require("firebase-functions-test")();
mockConfig.mockConfig({
  getprices: {
    auth_token: "token",
  },
});

describe("authenticateToken Testing Suite", () => {
  describe("when correct token is passed in", () => {
    it("returns true", () => {
      request.headers = {
        authentication: "token",
      };
      const { isAuthError, authStatusCode, authMessage } = authenticateToken(
        functions,
        request,
      );
      expect(isAuthError).toBeFalsy();
      expect(authStatusCode).toBeNull();
      expect(authMessage).toBeNull();
    });
  });
  describe("when environment token is not set", () => {
    const functionObjToErr = {
      config: () => {
        functionObjToErr.getprices = {};
        return functionObjToErr;
      },
    };
    it("returns 400 error", () => {
      request.headers = {
        authentication: "key",
      };
      const { isAuthError, authStatusCode, authMessage } = authenticateToken(
        functionObjToErr,
        request,
      );
      expect(isAuthError).toBeTruthy();
      expect(authStatusCode).toEqual(400);
      expect(authMessage).toBe("ERROR: UNSET API KEY ENV VAR");
    });
  });
  describe("when given wrong token", () => {
    it("returns 401 error", () => {
      request.headers = {
        authentication: "wrongKey",
      };
      const { isAuthError, authStatusCode, authMessage } = authenticateToken(
        functions,
        request,
      );
      expect(isAuthError).toBeTruthy();
      expect(authStatusCode).toEqual(401);
      expect(authMessage).toBe("Invalid Authorization Token");
    });
  });
});
