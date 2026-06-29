const form = document.querySelector("#application-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Отправка...";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не удалось отправить заявку.");

    form.reset();
    status.textContent = "Заявка сохранена.";
  } catch (error) {
    status.textContent = error.message;
  }
});
