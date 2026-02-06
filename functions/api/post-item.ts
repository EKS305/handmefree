export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");

    if (!title || !description) {
      return Response.redirect(
        "/post?error=Missing+title+or+description",
        303
      );
    }

    // TEMPORARY: no DB yet
    console.log("NEW ITEM:", {
      title,
      description,
    });

    return Response.redirect("/post/success", 303);
  } catch (err) {
    console.error(err);
    return Response.redirect(
      "/post?error=Internal+error",
      303
    );
  }
};
