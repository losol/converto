// src/swaggerPlugin/index.ts

import Swagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import { swaggerOptions } from "./swaggerOptions.js";

export async function registerOpenapiPlugin(fastify: FastifyInstance) {
	fastify.register(Swagger, swaggerOptions);
	await fastify.register(fastifyApiReference, {
		routePrefix: "/openapi",
	});
}
