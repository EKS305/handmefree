document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("post-item-form");

  if (!form) {
    console.error("Form #post-item-form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");

    if (!titleInput || !descriptionInput) {
      alert("Missing form fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("description", descriptionInput.value);

    try {
      const response = await fetch(
        "https://handmefree-post-item.ehsankarimi27.workers.dev",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error || "Server error");
      }

      alert("Item posted successfully\nID: " + data.id);
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to post item");
    }
  });
});
