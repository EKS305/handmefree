export const onRequest: PagesFunction = async ({ request, env }) => {
  // --- CORS ---
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://handmefree.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");

    if (!title || !description) {
      return new Response("Missing fields", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // TEMP: store item (DB already exists, but keep simple for now)
    await env.DB.prepare(
      "INSERT INTO items (title, description) VALUES (?, ?)"
    )
      .bind(title.toString(), description.toString())
      .run();

    return new Response("Item posted (temporary)", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};
