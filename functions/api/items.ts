export const onRequestGet: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);
  const city = url.searchParams.get("city");

  if (!city) {
    return new Response(
      JSON.stringify({ error: "Missing city" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { results } = await env.DB.prepare(
    "SELECT id, title, description, created_at FROM items WHERE city = ? ORDER BY created_at DESC"
  )
    .bind(city)
    .all();

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
