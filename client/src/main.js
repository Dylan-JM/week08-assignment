const messageForm = document.querySelector("#messageForm");

function handleSubmitMessageForm(event) {
  event.preventDefault();

  const formData = new FormData(messageForm);
  const msg_name = formData.get("msg_name");
  const content = formData.get("content");

  fetch("http://localhost:8080/messages", {
    method: "POST", // This is where we set the POST HTTP verb
    headers: {
      "Content-Type": "application/json", // This tells the server we're sending stringified JSON data
    },
    body: JSON.stringify({ msg_name, content }),
  });
}

messageForm.addEventListener("submit", handleSubmitMessageForm);
