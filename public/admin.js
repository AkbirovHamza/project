const tbody = document.querySelector("#applications");
const status = document.querySelector("#admin-status");
const refresh = document.querySelector("#refresh");

const formatDate = (value) =>
  new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const cell = (value) => {
  const td = document.createElement("td");
  td.textContent = value || "-";
  return td;
};

async function loadApplications() {
  status.textContent = "Загрузка заявок...";
  tbody.replaceChildren();

  try {
    const response = await fetch("/api/applications");
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не удалось загрузить заявки.");

    if (result.applications.length === 0) {
      status.textContent = "Заявок пока нет.";
      return;
    }

    for (const application of result.applications) {
      const row = document.createElement("tr");
      row.append(
        cell(formatDate(application.createdAt)),
        cell(application.name),
        cell(application.phone),
        cell(application.email),
        cell(application.message),
      );
      tbody.append(row);
    }

    status.textContent = `Загружено заявок: ${result.applications.length}`;
  } catch (error) {
    status.textContent = error.message;
  }
}

refresh.addEventListener("click", loadApplications);
loadApplications();
