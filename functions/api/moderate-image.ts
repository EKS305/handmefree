export const onRequest = async ({ request, env }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(JSON.stringify({ error: "Invalid upload" }), { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  const result = await env.AI.run(
    "@cf/meta/llama-3.2-11b-vision-instruct",
    {
      image: [...new Uint8Array(buffer)],
      prompt:
        "Detect: real humans, pets, wild animals, medicine, drugs, nudity. Respond briefly."
    }
  );

  const text = JSON.stringify(result).toLowerCase();

  if (text.includes("human") || text.includes("person") || text.includes("face")) {
    return Response.json({ allowed: false, reason: "Real humans are not allowed" }, { status: 403 });
  }

  if (text.includes("drug") || text.includes("medicine") || text.includes("pill")) {
    return Response.json({ allowed: false, reason: "Medicine or drugs are not allowed" }, { status: 403 });
  }

  if (
    (text.includes("animal") || text.includes("wildlife")) &&
    !text.includes("dog") &&
    !text.includes("cat")
  ) {
    return Response.json({ allowed: false, reason: "Only pets are allowed" }, { status: 403 });
  }

  return Response.json({ allowed: true });
};
