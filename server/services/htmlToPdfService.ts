import { Strapi } from "@strapi/strapi";

const puppeteer = require("puppeteer");

/**
 * @param {!function} pageInit
 * @param {!{format?: string, scale?: number}} options
 * @returns {Promise<*>}
 */
const generatePdf = async (pageInit, options) => {
  // Check if NoSandbox flag is set. For running this on Heroku, the
  // PUPPETEER_NOSANDBOX environment variable must be set to "true"
  const puppeteerArgs =
    process.env.PUPPETEER_NOSANDBOX === "true" ? ["--no-sandbox"] : [];
  const browser = await puppeteer.launch({
    headless: "new",
    args: puppeteerArgs,
  });
  const page = await browser.newPage();
  await pageInit(page);
  const buffer = await page.pdf({
    format: options.format,
    scale: options.scale,
  });
  await browser.close();
  return buffer;
};

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * @param {string} url URL to render.
   * @param {!{format?: string, scale?: number}=} options
   * @returns {Promise<Buffer>}
   */
  url2pdf: async (url, options = {}) => {
    return await generatePdf(async (page) => {
      await page.goto(url, { waitUntil: "networkidle2" });
    }, options);
  },

  /**
   * @param {string} html
   * @param {!{format?: string, scale?: number}=} options
   * @returns {Promise<Buffer>}
   */
  html2pdf: async (html, options = {}) => {
    return await generatePdf(async (page) => {
      await page.setContent(html, { waitUntil: "networkidle2" });
    }, options);
  },
});
