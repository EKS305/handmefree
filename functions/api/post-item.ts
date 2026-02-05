export const onRequestPost: PagesFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || !description) {
    return new Response("Missing fields", { status: 400 });
  }

  return new Response(
    "Item posted (temporary)",
    { status: 200 }
  );
};
