import controller from "../server/controllers/htmlToPdfController";
import { Buffer } from "node:buffer";
import errorMessages from "../server/controllers/errorMessages";
import { getStrapiContext, getStrapiMockInstance } from "./utils";

describe("HTML to PDF controller - proper functioning with proper input", () => {
  let strapi: any;

  beforeEach(async function () {
    strapi = getStrapiMockInstance();
  });
  it("Should throw nothing and return a buffer when all input is passed in correctly", async () => {
    const ctx = getStrapiContext({});
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(0);
    expect(ctx.body).toBeInstanceOf(Buffer);
  });
});

describe("HTML to PDF controller - check 400s properly thrown when invalid parameters are given", () => {
  let strapi: any;

  beforeEach(async function () {
    strapi = getStrapiMockInstance();
  });
  it("Should throw a 400 code with a custom message when url or html body parameter does not exist", async () => {
    const ctx = getStrapiContext(null);
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(400, errorMessages.URL_HTML_REQUIRED);
  });
  it("Should throw a 400 code with a custom message when both url and html are given", async () => {
    const ctx = getStrapiContext({ url: "http://www.google.com/" });

    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(400, errorMessages.ONLY_URL_OR_HTML);
  });
  it("Should throw a 400 code when an invalid format is given", async () => {
    const ctx = getStrapiContext({ format: "invalid" });
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(400, expect.anything());
  });
  it("Should throw a 400 code with a custom message when scale is larger than 2", async () => {
    const ctx = getStrapiContext({ scale: 3 });
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(400, errorMessages.SCALE_INVALID_VALUE);
  });
  it("Should throw a 400 code when scale is a string", async () => {
    const ctx = getStrapiContext({ scale: "3" });
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(400, expect.anything());
  });
});

describe("HTML to PDF controller - service errors should return 500s", () => {
  let strapi: any;
  beforeEach(async function () {
    strapi = getStrapiMockInstance(true);
  });
  it("Should throw a 500 code with a proper message when service.html2pdf throws an error", async () => {
    const ctx = getStrapiContext({});
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(
      500,
      errorMessages.HTML_POSSIBLY_MALFORMED
    );
  });
  it("Should throw a 500 code with a proper message when service.url2pdf service throws an error", async () => {
    const ctx = getStrapiContext({}, false);
    await controller({ strapi }).convert(ctx);
    expect(ctx.throw).toBeCalledTimes(1);
    expect(ctx.throw).toBeCalledWith(500, errorMessages.INVALID_URL);
  });
});
