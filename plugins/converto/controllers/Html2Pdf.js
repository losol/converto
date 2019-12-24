"use strict";

const service = require("../services/Html2Pdf");
const { parseMultipartData } = require("strapi-utils");

function getOptions(ctx) {
  let scale;
  if (ctx.request.body.scale) {
    scale = parseFloat(ctx.request.body.scale);
    if (isNaN(scale) || scale < 0.1 || scale > 2) {
      ctx.throw(
        400,
        "Invalid value for scale query parameter given. Expected is number within 0.1...2 range."
      );
    }
  }
  return {
    format: ctx.request.body.format || "A4",
    scale: scale || 1
  };
}

module.exports = {

  convert: async ctx => {
    // Check that either url or html is posted
    if (!ctx.request.body.url && !ctx.request.body.html) {
      ctx.throw(400, "Either url or html is required");
    }

    if (ctx.request.body.url && ctx.request.body.html) {
      ctx.throw(
        400,
        "Both url and html were posted. Only one is allowed, please do not confuse me."
      );
    }
    if (!ctx.request.body) {
      ctx.throw(
        400,
        "Request should be made with Content-Type: multipart/form-data"
      );
    }

    // Set Content type to output
    ctx.set("Content-Type", "application/pdf");

    // Return pdf based on request type
    if (ctx.request.body.html) {
      ctx.body = await service.html2pdf(ctx.request.body.html, getOptions(ctx));
    }
    else {
      ctx.body = await service.url2pdf(ctx.request.body.url, getOptions(ctx));
    }
  }
};
