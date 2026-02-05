export const onRequestPost: PagesFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || !description) {
    return new Response("Missing fields", { status: 400 });
  }

  // TEMP: no database yet
  console.log("ITEM POSTED:", { title, description });

  // 🔑 THIS IS THE FIX
  return Response.redirect("/post/success", 303);
};
