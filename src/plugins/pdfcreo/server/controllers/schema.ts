import { z } from "zod";
import errorMessages from "./errorMessages";
//taken from puppeteer's PaperFormat type, sadly type to schema is not a thing, therefore copying

const paperFormats = z.enum([
  "Letter",
  "Legal",
  "Tabloid",
  "Ledger",
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
]);
export default z
  .object({
    html: z.string().optional(),
    url: z.string().optional(),
    scale: z.number().default(1),
    format: paperFormats.default("A4"),
  })
  .superRefine(({ html, url, scale }, ctx) => {
    if (!html && !url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessages.URL_HTML_REQUIRED,
      });
      return z.NEVER;
    }
    if (html && url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessages.ONLY_URL_OR_HTML,
      });
      return z.NEVER;
    }
    if (isNaN(scale) || scale < 0.1 || scale > 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessages.SCALE_INVALID_VALUE,
      });
    }
  });
