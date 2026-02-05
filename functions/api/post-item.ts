export const onRequestPost: PagesFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || !description) {
    return new Response("Missing fields", { status: 400 });
  }

  // TEMPORARY: log only (no DB yet)
  console.log("NEW ITEM");
  console.log("Title:", title);
  console.log("Description:", description);

  // ✅ Redirect back to form with success flag
  return Response.redirect("/post?ok=1", 303);
};

