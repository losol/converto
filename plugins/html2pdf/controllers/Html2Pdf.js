'use strict';

const service = require('../services/Html2Pdf');

function getOptions(ctx) {
  let scale = undefined;
  if (ctx.query.hasOwnProperty('scale')) {
    scale = parseFloat(ctx.query.scale);
    if (isNaN(scale) || scale < 0.1 || scale > 2) {
      ctx.throw(400, 'Invalid value for scale query parameter given. Expected is number within 0.1...2 range.');
    }
  }
  return {
    format: ctx.query.format || 'A4',
    scale: scale || 1
  };
}

module.exports = {

  url2pdf: async (ctx) => {
    if (!ctx.query.url) {
      ctx.throw(400, 'url query parameter is required');
    }
    ctx.set('Content-Type', 'application/pdf');
    ctx.body = await service.url2pdf(ctx.query.url, getOptions(ctx));
  },

  html2pdf: async (ctx) => {
    if (!ctx.request.body) {
      ctx.throw(400, 'Request should be made with Content-Type: text/plain header');
    }
    ctx.set('Content-Type', 'application/pdf');
    ctx.body = await service.html2pdf(ctx.request.body, getOptions(ctx));
  }
};
