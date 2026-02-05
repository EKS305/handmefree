export const onRequestPost: PagesFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !title.trim() ||
    !description.trim()
  ) {
    return new Response("Invalid submission", { status: 400 });
  }

  // TEMPORARY: log only (no DB yet)
  console.log("NEW ITEM:", { title, description });

  // ✅ IMPORTANT PART:
  // Redirect after successful POST
  return Response.redirect("/post/success", 303);
};
