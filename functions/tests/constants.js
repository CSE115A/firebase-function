const functions = {
  config: () => {
    return {
      getprices: {
        uber_endpoint: "www.test.com",
        lyft_endpoint: "www.test1.com",
        auth_token: "token",
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
  set: () => {},
};

const params = {
  startingLatitude: 123,
  startingLongitude: 123,
  endLongitude: 123,
  endLatitude: 123,
};

const responseBody = {};

const request = {};

module.exports = {
  functions,
  responseBody,
  params,
  response,
  request,
};
