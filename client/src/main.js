const messageForm = document.querySelector("#messageForm");

async function handleSubmitMessageForm(event) {
  event.preventDefault();

  const formData = new FormData(messageForm);
  const username = formData.get("username");
  const message = formData.get("message");
  const category = formData.get("category");

  await fetch("https://week08-assignment-server.onrender.com/guestbook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, message, category }),
  });

  document.getElementById("messageForm").reset();
  await fetchGuestbookEntries();
}

messageForm.addEventListener("submit", handleSubmitMessageForm);

async function fetchGuestbookEntries() {
  const response = await fetch(
    "https://week08-assignment-server.onrender.com/guestbook",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);

  const list = document.getElementById("message-list");
  list.innerHTML = "";

  data.guestbook.forEach((event) => {
    const listItem = document.createElement("li");

    const messageText = document.createElement("span");
    messageText.textContent = `${event.username} (${event.category}): ${event.message}`;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-button");
    deleteBtn.addEventListener("click", async () => {
      await fetch(
        `https://week08-assignment-server.onrender.com/guestbook/${event.id}`,
        {
          method: "DELETE",
        }
      );
      await fetchGuestbookEntries();
    });

    // Like button
    const likeBtn = document.createElement("button");
    likeBtn.textContent = "❤️";
    likeBtn.classList.add("like-button");
    likeBtn.addEventListener("click", async () => {
      await fetch(
        `https://week08-assignment-server.onrender.com/guestbook/${event.id}/like`,
        {
          method: "POST",
        }
      );
      await fetchGuestbookEntries();
    });

    const likeCount = document.createElement("span");
    likeCount.textContent = `(${event.likes || 0})`;

    const likeContainer = document.createElement("div");
    likeContainer.classList.add("like-container");
    likeContainer.appendChild(likeBtn);
    likeContainer.appendChild(likeCount);

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");
    messageContainer.appendChild(messageText);
    messageContainer.appendChild(likeContainer);

    listItem.appendChild(messageContainer);
    listItem.appendChild(deleteBtn);
    list.appendChild(listItem);
  });
}
fetchGuestbookEntries();
