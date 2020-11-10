exports.authenticateToken = (functions, requestObject) => {
  const { headers } = requestObject;
  const correctKey = functions.config().getprices.auth_token;
  if (correctKey === undefined) {
    return {
      isAuthError: true,
      authStatusCode: 500,
      authMessage: "ERROR: UNSET API KEY ENV VAR",
    };
  }

  return {
    isAuthError: headers.authentication !== correctKey,
    authStatusCode: headers.authentication === correctKey ? null : 401,
    authMessage:
      headers.authentication !== correctKey
        ? "Invalid Authorization Token"
        : null,
  };
};
