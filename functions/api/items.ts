import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequestGet: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);

  const id = url.searchParams.get("id");
  const city = url.searchParams.get("city");

  // ✅ 1. SINGLE ITEM (used by /items/[id].astro)
  if (id) {
    const item = await env.KV.get(id, "json");

    if (!item) {
      return new Response(
        JSON.stringify({ ok: false, error: "Item not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, item }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // ✅ 2. LIST BY CITY (existing behavior)
  if (city) {
    const { results } = await env.DB.prepare(
      "SELECT id, title, description, created_at FROM items WHERE city = ? ORDER BY created_at DESC"
    )
      .bind(city)
      .all();

    return new Response(
      JSON.stringify({ ok: true, items: results }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  // ❌ Nothing provided
  return new Response(
    JSON.stringify({ ok: false, error: "Missing id or city" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
};
