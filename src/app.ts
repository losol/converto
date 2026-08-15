import dotenv from "dotenv";
import Fastify, { type FastifyInstance } from "fastify";
import { registerAuthPlugin } from "./features/auth/index.js";
import { registerHealthRoutes } from "./features/health/index.js";
import { registerHomepagePlugin } from "./features/homepage/index.js";
import { registerOpenapiPlugin } from "./features/openapi/index.js";
import { registerPdfFeature } from "./features/pdf/index.js";
import { registerRatelimitPlugin } from "./features/ratelimit/index.js";

dotenv.config();

export async function buildApp(): Promise<FastifyInstance> {
	const fastify: FastifyInstance = Fastify({ logger: true });

	await registerRatelimitPlugin(fastify);
	await registerOpenapiPlugin(fastify);
	await registerAuthPlugin(fastify);
	await registerPdfFeature(fastify);
	await registerHealthRoutes(fastify);
	await registerHomepagePlugin(fastify);

	return fastify;
}

// Only start the server when run directly (not imported by tests)
const isMainModule =
	process.argv[1]?.endsWith("app.js") || process.argv[1]?.endsWith("app.ts");
if (isMainModule) {
	const fastify = await buildApp();

	fastify.log.info(`Fastify routes registered:\n${fastify.printRoutes()}`);

	try {
		const port = process.env.PORT
			? Number.parseInt(process.env.PORT, 10)
			: 3100;
		const host = process.env.HOST ?? "0.0.0.0";

		await fastify.listen({ port, host });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
