let language = ""; // Store user's chosen language

// Detect "Enter" key press to send message
function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    var user_input = document.getElementById("user_input").value.trim();
    if (!user_input) return;

    var chatbox = document.getElementById("chatbox");

    // Add user message to chatbox
    chatbox.innerHTML += `<div class="message user">${user_input}</div>`;

    // If language is not selected, ask first
    if (!language) {
        if (user_input.toLowerCase() === "tamil" || user_input.toLowerCase() === "english") {
            language = user_input.toLowerCase();
            chatbox.innerHTML += `<div class="message bot">You selected ${language.toUpperCase()}! Now enter your news text.</div>`;
        } else {
            chatbox.innerHTML += `<div class="message bot">Invalid choice! Type <b>"Tamil"</b> or <b>"English"</b>.</div>`;
        }
        document.getElementById("user_input").value = "";
        chatbox.scrollTop = chatbox.scrollHeight;
        return;
    }

    // Show typing indicator dynamically
    let typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot", "typing-indicator");
    typingIndicator.innerHTML = "Typing...";
    chatbox.appendChild(typingIndicator);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Clear input field after sending message
    document.getElementById("user_input").value = "";

    // Send message to Flask backend
    fetch("/chatbot", {
        method: "POST",
        body: JSON.stringify({ message: user_input, language: language }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator after response
        typingIndicator.remove();

        // Show chatbot response
        chatbox.innerHTML += `<div class="message bot">${data.response}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(error => {
        typingIndicator.remove();
        chatbox.innerHTML += `<div class="message bot">Error: Could not get response. Try again.</div>`;
        console.error("Error fetching chatbot response:", error);
    });
}
