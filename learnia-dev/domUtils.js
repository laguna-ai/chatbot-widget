
// Formatea el mensaje para mostrarlo en HTML, escapando caracteres peligrosos y soportando markdown básico
function formatMessage(msg) {
    if (!msg) return "";
    // 1. Proteger los <br> ya existentes (y variantes)
    msg = msg.replace(/<br\s*\/?>/gi, "___BR___");
    // 2. Escapar HTML peligroso
    msg = msg
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    // 3. Restaurar los <br> originales
    msg = msg.replace(/___BR___/g, "<br>");
    // 4. Reemplazar saltos de línea por <br>
    msg = msg.replace(/\n/g, "<br>");
    // 5. Markdown: negrita, cursiva, links
    msg = msg
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#0066cc; text-decoration:underline;">$1</a>');
    return msg;
}

// Agrega un mensaje al chat (usuario o asistente)
export function addMessage(msg, role, chatMessages) {
    const formatted = formatMessage(msg);
    const msgDiv = document.createElement("div");
    msgDiv.className = "message-enter mb-4";
    const time = (new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (role === "user") {
        msgDiv.innerHTML = `
            <div class="flex justify-end">
                <div class="bg-primary-100 p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-200">
                    <p class="text-primary-900 text-left">${formatted}</p>
                </div>
            </div>
            <div class="text-xs text-primary-500 mt-1 text-right">${time}</div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-white border border-primary-200 flex items-center justify-center mr-2 text-lg">
                    <img src="img/12.png" alt="MentIA" class="w-6 h-6">
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-100">
                    <p class="text-primary-900 text-left">${formatted}</p>
                </div>
            </div>
            <div class="text-xs text-primary-500 mt-1 pl-10">${time}</div>
        `;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Inicializa el widget con mensaje inicial, marca, sugerencias y colores
export function initWidget(config) {
    if (config.initialMessage) {
        const firstMsg = document.querySelector("#chat-messages .message-enter");
        if (firstMsg) {
            const p = firstMsg.querySelector("p");
            if (p) p.textContent = config.initialMessage;
        }
    }
    if (config.brandName) {
        document.querySelectorAll(".font-semibold").forEach(el => {
            if (el.textContent === "TuEmpresa") el.textContent = config.brandName;
        });
    }
    if (config.suggestions && config.suggestions.length > 0) {
        document.querySelectorAll(".suggestion-btn").forEach((el, idx) => {
            if (config.suggestions[idx]) el.textContent = config.suggestions[idx];
        });
    }
    if (config.primaryColor) {
        document.documentElement.style.setProperty("--color-primary-500", config.primaryColor);
    }
    if (config.secondaryColor) {
        document.documentElement.style.setProperty("--color-secondary-600", config.secondaryColor);
    }
}

// Crea el elemento de mensaje para streaming (respuesta parcial)
export function createStreamingMessageElement(messageId) {
    const time = (new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const div = document.createElement("div");
    div.className = "message-enter mb-4";
    div.id = messageId;
    div.innerHTML = `
        <div class="flex items-start">
            <div class="w-8 h-8 rounded-full bg-white border border-primary-200 flex items-center justify-center mr-2 text-lg">
                <img src="img/12.png" alt="MentIA" class="w-6 h-6">
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-100">
                <p class="text-primary-900 text-left" id="${messageId}-content">
                    <span class="typing-indicator">
                        <span class="text-primary-600">.</span>
                        <span class="text-primary-600">.</span>
                        <span class="text-primary-600">.</span>
                    </span>
                </p>
            </div>
        </div>
        <div class="text-xs text-primary-500 mt-1 pl-10">${time}</div>
    `;
    return div;
}

// Actualiza el mensaje streaming con el chunk recibido
export function updateMessageElement(messageId, chunk) {
    const content = document.getElementById(`${messageId}-content`);
    if (content) {
        const typing = content.querySelector(".typing-indicator");
        if (typing) typing.remove();
        content.innerHTML += formatMessage(chunk);
    }
}

// Finaliza el mensaje streaming mostrando el texto completo
export function finalizeMessageElement(messageId, fullText) {
    const content = document.getElementById(`${messageId}-content`);
    if (content) {
        content.innerHTML = formatMessage(fullText);
    }
}