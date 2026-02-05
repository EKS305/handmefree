import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequest: PagesFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || !description) {
    return new Response(
      JSON.stringify({ error: "Missing fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Item posted (temporary)",
      item: { title, description }
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
