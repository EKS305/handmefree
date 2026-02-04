export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  // 🔓 Explicitly allow POSTs (fixes CSRF block)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Invalid upload" }),
      { status: 400, headers }
    );
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || !(file instanceof File)) {
    return new Response(
      JSON.stringify({ error: "No image provided" }),
      { status: 400, headers }
    );
  }

  const buffer = await file.arrayBuffer();

  const result: any = await env.AI.run(
    "@cf/openai/vision-classification",
    {
      image: [...new Uint8Array(buffer)],
    }
  );

  const labels = result?.labels || [];

  const hasHuman = labels.some((l: any) =>
    ["person", "human", "face", "body"].includes(l.label)
  );

  const hasDrugs = labels.some((l: any) =>
    ["drug", "medicine", "pill", "syringe"].includes(l.label)
  );

  const hasAnimal = labels.some((l: any) =>
    ["animal", "wildlife", "cow", "horse"].includes(l.label)
  );

  const isPet = labels.some((l: any) =>
    ["dog", "cat", "pet"].includes(l.label)
  );

  if (hasHuman) {
    return new Response(
      JSON.stringify({ allowed: false, reason: "Real humans are not allowed" }),
      { status: 403, headers }
    );
  }

  if (hasDrugs) {
    return new Response(
      JSON.stringify({ allowed: false, reason: "Medicine or drugs are not allowed" }),
      { status: 403, headers }
    );
  }

  if (hasAnimal && !isPet) {
    return new Response(
      JSON.stringify({ allowed: false, reason: "Only pets are allowed" }),
      { status: 403, headers }
    );
  }

  return new Response(
    JSON.stringify({ allowed: true }),
    { status: 200, headers }
  );
};
