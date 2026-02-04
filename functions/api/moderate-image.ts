export const onRequestPost = async ({ request, env }) => {
  try {
    // Only allow POST
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response("Invalid upload", { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return new Response("No image provided", { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    // ✅ Workers AI Vision model (free, no API key)
    const result = await env.AI.run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      {
        image: [...new Uint8Array(buffer)],
        prompt:
          "Classify this image. Answer with labels only. Detect: real humans, pets, wild animals, medicine, drugs, nudity."
      }
    );

    const text = JSON.stringify(result).toLowerCase();

    // 🚫 Real humans
    if (
      text.includes("human") ||
      text.includes("person") ||
      text.includes("face") ||
      text.includes("people")
    ) {
      return Response.json(
        { allowed: false, reason: "Real humans are not allowed" },
        { status: 403 }
      );
    }

    // 🚫 Medicine / drugs
    if (
      text.includes("drug") ||
      text.includes("medicine") ||
      text.includes("pill") ||
      text.includes("syringe")
    ) {
      return Response.json(
        { allowed: false, reason: "Medicine or drugs are not allowed" },
        { status: 403 }
      );
    }

    // 🚫 Wild animals (pets allowed)
    if (
      (text.includes("animal") || text.includes("wildlife")) &&
      !text.includes("dog") &&
      !text.includes("cat") &&
      !text.includes("pet")
    ) {
      return Response.json(
        { allowed: false, reason: "Only pets are allowed" },
        { status: 403 }
      );
    }

    // 🚫 Nudity
    if (text.includes("nude") || text.includes("nudity") || text.includes("sexual")) {
      return Response.json(
        { allowed: false, reason: "Nudity is not allowed" },
        { status: 403 }
      );
    }

    // ✅ Allowed
    return Response.json({ allowed: true });
  } catch (err) {
    return new Response("Moderation failed", { status: 500 });
  }
};
