import { Strapi } from "@strapi/strapi";
import { ZodError } from "zod";
import { HTMLToPDFService } from "../services/htmlToPdfService";
import schema from "./schema";
import errorMessages from "./errorMessages";
export default ({ strapi }: { strapi: Strapi }) => ({
  async convert(ctx: any) {
    const result = schema.safeParse(ctx.request.body);
    //has to be a strict check, see https://github.com/colinhacks/zod/issues/1190#issuecomment-1171607138
    if (result.success === false) {
      const err: ZodError = result.error;
      let message = err.errors[0].message;
      if (err.errors[0]?.path?.length) {
        //if we haven't set a custom message, then zod
        //supplies the message, but we have to add
        //the path (e.g. 'scale') to make sense of the error message
        message = `${err.errors[0].path[0]} : ${message}`;
      }

      ctx.throw(400, message);
      return;
    }

    const { html, url, scale, format } = result.data;
    // Set Content type to output
    ctx.set("Content-Type", "application/pdf");
    const service = strapi
      .plugin("pdfcreo")
      .service("htmlToPdfService") as HTMLToPDFService;
    // Return pdf based on request type
    if (html) {
      ctx.body = await service.html2pdf(html, scale, format).catch(() => {
        ctx.throw(500, errorMessages.HTML_POSSIBLY_MALFORMED);
      });
    }
    if (url) {
      ctx.body = await service.url2pdf(url, scale, format).catch(() => {
        ctx.throw(500, errorMessages.INVALID_URL);
      });
    }
  },
});
