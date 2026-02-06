export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");

    if (!title || !description) {
      return new Response("Missing fields", { status: 400 });
    }

    // TEMP: no DB yet, just confirm flow works
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/post/success",
      },
    });
  } catch (err) {
    return new Response("Internal error", { status: 500 });
  }
};
