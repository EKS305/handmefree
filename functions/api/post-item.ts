export const onRequestPost: PagesFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || !description) {
    return new Response("Missing fields", { status: 400 });
  }

  // TEMPORARY: no database yet
  // Just confirm it works
  return new Response(
    `Item posted (temporary)\n\nTitle: ${title}\nDescription: ${description}`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
};
