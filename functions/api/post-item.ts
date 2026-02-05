export const onRequestPost: PagesFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || !description) {
    return new Response("Missing fields", { status: 400 });
  }

  // TEMPORARY: log instead of saving
  console.log("New item posted:", {
    title,
    description,
  });

  // Redirect to confirmation page
  return Response.redirect("/post/success", 303);
};
