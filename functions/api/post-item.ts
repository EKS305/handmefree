import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");

    if (typeof title !== "string" || typeof description !== "string") {
      return new Response("Missing fields", { status: 400 });
    }

    const id = crypto.randomUUID();

    await env.KV.put(
      id,
      JSON.stringify({
        id,
        title,
        description,
        images: [],
        createdAt: new Date().toISOString(),
      })
    );

    return new Response(null, {
      status: 302,
      headers: { Location: `/items/${id}` },
    });
  } catch {
    return new Response("Internal error", { status: 500 });
  }
};
