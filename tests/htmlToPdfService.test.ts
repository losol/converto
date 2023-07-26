import serviceFactory, {
  HTMLToPDFService,
} from "../server/services/htmlToPdfService";

/**
 * These tests should not be run in a CI environment such as github workflows etc - running puppeteer is
 * too costly and takes too much time for it to be worthwhile. These tests should be run at developer discretion
 * only.
 */

let service: HTMLToPDFService = serviceFactory();
//remarkably html2pdf does not throw errors, as puppeteer will spit out a pdf regardless of malformed html
//so we wont test these, so we are only testing url2pdf
describe("HTML to PDF service - throw errors when invalid options given", () => {
  afterAll(() => {});
  test("url2pdf to throw error with host that does not exist", async () => {
    await expect(
      service.url2pdf("http://www.invalid-does-not-exist.tr/")
    ).rejects.toThrow(expect.anything());
  }, 20000);
});
