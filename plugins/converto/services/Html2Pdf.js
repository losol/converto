'use strict';

const puppeteer = require('puppeteer');

/**
 * @param {!function} pageInit
 * @param {!{format?: string, scale?: number}} options
 * @returns {Promise<*>}
 */
async function generatePdf(pageInit, options) {

  // Check if NoSandbox flag is set. For running this on Heroku, the 
  // PUPPETEER_NOSANDBOX environment variable must be set to "true"
  const browser =
    process.env.PUPPETEER_NOSANDBOX === "true"
      ? await puppeteer.launch({ args: ["--no-sandbox"] })
      : await puppeteer.launch();
  const page = await browser.newPage();
  await pageInit(page);
  const buffer = await page.pdf({
    format: options.format,
    scale: options.scale
  });
  await browser.close();
  return buffer;
}

module.exports = {

  /**
   * @param {string} url URL to render.
   * @param {!{format?: string, scale?: number}=} options
   * @returns {Promise<Buffer>}
   */
  url2pdf: async (url, options = {}) => {
    return await generatePdf(async (page) => {
      await page.goto(url, {waitUntil: 'networkidle2'});
    }, options);
  },

  /**
   * @param {string} html
   * @param {!{format?: string, scale?: number}=} options
   * @returns {Promise<Buffer>}
   */
  html2pdf: async (html, options = {}) => {
    return await generatePdf(async (page) => {
      await page.setContent(html, {waitUntil: 'networkidle2'});
    }, options);
  }
};
