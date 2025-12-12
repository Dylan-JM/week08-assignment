const messageForm = document.querySelector("#messageForm");

function handleSubmitMessageForm(event) {
  event.preventDefault();

  const formData = new FormData(messageForm);
  const username = formData.get("username");
  const message = formData.get("message");
  const category = formData.get("category");

  fetch("http://localhost:8080/guestbook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, message, category }),
  });

  document.getElementById("messageForm").reset();
}

messageForm.addEventListener("submit", handleSubmitMessageForm);

async function fetchGuestbookEntries() {
  const response = await fetch("http://localhost:8080/guestbook", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);

  const list = document.getElementById("message-list");
  list.innerHTML = "";

  data.guestbook.forEach((event) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${event.username} (${event.category}): ${event.message}`;
    list.appendChild(listItem);
  });
}

fetchGuestbookEntries();
