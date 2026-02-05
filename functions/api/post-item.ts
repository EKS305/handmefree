export const onRequest: PagesFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !title.trim() ||
    !description.trim()
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  // TEMPORARY: log instead of saving to DB
  console.log("NEW ITEM POSTED:", {
    title,
    description,
  });

  // ✅ REDIRECT after successful submit
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/post/success",
    },
  });
};
