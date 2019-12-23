'use strict';

const puppeteer = require('puppeteer');

/**
 * Converto.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {

  /**
   * @param {string} url URL to render.
   * @param {!{format?: string, scale?: number}=} options
   * @returns {Promise<Buffer>}
   */
  url2pdf: async (url, options = {}) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    const buffer = await page.pdf({
      format: options.format || 'A4',
      scale: options.scale
    });
    await browser.close();
    return buffer;
  },

  /**
   * @param {string} html
   * @param {!{format?: string, scale?: number}=} options
   * @returns {Promise<Buffer>}
   */
  html2pdf: async (html, options = {}) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle2'});
    const buffer = await page.pdf({
      format: options.format || 'A4',
      scale: options.scale
    });
    await browser.close();
    return buffer;
  }
};
