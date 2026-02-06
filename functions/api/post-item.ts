import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");

    if (typeof title !== "string" || typeof description !== "string") {
      return new Response("Missing fields", { status: 400 });
    }

    // ✅ CREATE ITEM (this was missing before)
    const id = crypto.randomUUID();

    const item = {
      id,
      title,
      description,
      images: [],
      createdAt: new Date().toISOString(),
    };

    await env.KV.put(id, JSON.stringify(item));

    // ✅ KEEP OLD BEHAVIOR (redirect)
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/items/${id}`,
      },
    });
  } catch (err) {
    return new Response("Internal error", { status: 500 });
  }
};
