const { NextRequest } = require("next/server");
const { updateSession } = require("./lib");

async function middleware(request) {
  return await updateSession(request);
}

module.exports = { middleware };
