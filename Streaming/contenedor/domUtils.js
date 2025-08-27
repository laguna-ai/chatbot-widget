// domUtils.js

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


// Función para agregar un mensaje al chat
export function addMessage(text, sender, chatMessages) {
    const getTimeString = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedText = formatMessage(text);
    const messageElement = document.createElement('div');
    messageElement.className = 'message-enter mb-4';

    // Generador de HTML para usuario y bot
    const getMessageHTML = (isUser, content, time) =>
        isUser
            ? `<div class="flex justify-end">
                <div class="bg-primary-100 p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-200">
                    <p class="text-primary-900 text-left">${content}</p>
                </div>
            </div>
            <div class="text-xs text-primary-500 mt-1 text-right">${time}</div>`
            : `<div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-white border border-primary-200 flex items-center justify-center mr-2 text-lg">
                    <img src="contenedor/img/12.png" alt="MentIA" class="w-6 h-6">
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-100">
                    <p class="text-primary-900 text-left">${content}</p>
                </div>
            </div>
            <div class="text-xs text-primary-500 mt-1 pl-10">${time}</div>`;

    messageElement.innerHTML = getMessageHTML(sender === 'user', formattedText, getTimeString());
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para mostrar el indicador de que el bot está escribiendo
export function showTypingIndicator(typingIndicator, chatMessages) {
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para ocultar el indicador de que el bot está escribiendo
export function hideTypingIndicator(typingIndicator) {
    typingIndicator.classList.add('hidden');
}

// Función para inicializar el widget con la configuración
export function initWidget(config) {
    if (config.initialMessage) {
        const initialMessage = document.querySelector('#chat-messages .message-enter');
        if (initialMessage) {
            initialMessage.querySelector('p').textContent = config.initialMessage;
        }
    }
    
    if (config.brandName) {
        const brandElements = document.querySelectorAll('.font-semibold');
        brandElements.forEach(el => {
            if (el.textContent === 'TuEmpresa') {
                el.textContent = config.brandName;
            }
        });
    }
    
    if (config.suggestions && config.suggestions.length > 0) {
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach((btn, index) => {
            if (config.suggestions[index]) {
                btn.textContent = config.suggestions[index];
            }
        });
    }
    
    // Actualización de colores
    if (config.primaryColor) {
        document.documentElement.style.setProperty('--color-primary-500', config.primaryColor);
    }
    
    if (config.secondaryColor) {
        document.documentElement.style.setProperty('--color-secondary-600', config.secondaryColor);
    }
}


// STREAMING FUNCTIONS

// Función para crear un elemento de mensaje vacío para streaming
export function createStreamingMessageElement(id) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message-enter mb-4';
    messageElement.id = id;
    
    messageElement.innerHTML = `
        <div class="flex items-start">
            <div class="w-8 h-8 rounded-full bg-white border border-primary-200 flex items-center justify-center mr-2 text-lg">
                <img src="contenedor/img/12.png" alt="MentIA" class="w-6 h-6">
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-100">
                <p class="text-primary-900 text-left" id="${id}-content">
                    <span class="typing-indicator">
                        <span class="text-primary-600">.</span>
                        <span class="text-primary-600">.</span>
                        <span class="text-primary-600">.</span>
                    </span>
                </p>
            </div>
        </div>
        <div class="text-xs text-primary-500 mt-1 pl-10">${timeString}</div>
    `;
    
    return messageElement;
}

// Función para actualizar un mensaje en streaming
export function updateMessageElement(id, content) {
    const contentElement = document.getElementById(`${id}-content`);
    if (contentElement) {
        // Elimina el typing indicator si existe (solo la primera vez)
        const typing = contentElement.querySelector('.typing-indicator');
        if (typing) typing.remove();
        contentElement.innerHTML += formatMessage(content);
    }
}


// Función para finalizar un mensaje en streaming
export function finalizeMessageElement(id, content) {
    const contentElement = document.getElementById(`${id}-content`);
    if (contentElement) {
        contentElement.innerHTML = formatMessage(content);
    }
}
