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
}

messageForm.addEventListener("submit", handleSubmitMessageForm);
