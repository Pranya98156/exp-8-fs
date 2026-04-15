const serverless = require("serverless-http");

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    const appModule = await import("../server/src/app.js");
    handler = serverless(appModule.default);
  }

  return handler(req, res);
};
