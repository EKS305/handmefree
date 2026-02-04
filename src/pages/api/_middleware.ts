import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Disable Astro CSRF ONLY for API routes
  context.locals.disableAstroCSRF = true;
  return next();
};
