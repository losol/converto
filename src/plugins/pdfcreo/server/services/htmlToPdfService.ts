import { Strapi } from "@strapi/strapi";
import puppeteer, { Browser, HTTPResponse, Page, PaperFormat } from "puppeteer";

/**
 * @param {!function} pageInit
 * @param {!{format?: string, scale?: number}} options
 * @returns {Promise<*>}
 */
const generatePdf = async (
  pageInit: Function,
  format: PaperFormat,
  scale: number
): Promise<Buffer> => {
  // Check if no-sandbox or disable-setuid-sandbox is set.
  var puppeteerArgs =
    process.env.PUPPETEER_NOSANDBOX === "true" ? ["--no-sandbox"] : [];

  if (process.env.PUPPETEER_DISABLE_SETUID_SANDBOX === "true")
    puppeteerArgs.push("--disable-setuid-sandbox");

  const browser: Browser = await puppeteer.launch({
    headless: "new",
    args: puppeteerArgs,
  });
  const page: Page = await browser.newPage();
  await pageInit(page);
  const buffer = await page.pdf({
    format: format,
    scale: scale,
  });
  await browser.close();
  return buffer;
};

export interface HTMLToPDFService {
  url2pdf(url: string, scale?: number, format?: PaperFormat): Promise<Buffer>;
  html2pdf(html: string, scale?: number, format?: PaperFormat): Promise<Buffer>;
}

export default () =>
  ({
    /**
     * @param {string} url URL to render.
     * @param {!{format?: string, scale?: number}=} options
     * @returns {Promise<Buffer>}
     */
    url2pdf: async (url: string, scale = 1, format = "A4"): Promise<Buffer> => {
      return await generatePdf(
        async (page: Page) => {
          await page.goto(url, { waitUntil: "networkidle2" });
        },
        format,
        scale
      );
    },

    /**
     * @param {string} html
     * @param {!{format?: string, scale?: number}=} options
     * @returns {Promise<Buffer>}
     */
    html2pdf: async (html, scale = 1, format = "A4"): Promise<Buffer> => {
      return await generatePdf(
        async (page: Page) => {
          await page.setContent(html, { waitUntil: "networkidle2" });
        },
        format,
        scale
      );
    },
  } as HTMLToPDFService);
