export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

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
    return Response.json(
      { allowed: false, reason: "Real humans are not allowed" },
      { status: 403 }
    );
  }

  if (hasDrugs) {
    return Response.json(
      { allowed: false, reason: "Medicine or drugs are not allowed" },
      { status: 403 }
    );
  }

  if (hasAnimal && !isPet) {
    return Response.json(
      { allowed: false, reason: "Only pets are allowed" },
      { status: 403 }
    );
  }

  return Response.json({ allowed: true });
};
