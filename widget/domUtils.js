// domUtils.js

// Función para agregar un mensaje al chat
export function addMessage(text, sender, chatMessages) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message-enter mb-4';
    
    if (sender === 'user') {
        messageElement.innerHTML = `
            <div class="flex justify-end">
                <div class="bg-primary-100 p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-200">
                    <p class="text-gray-800">${text}</p>
                </div>
            </div>
            <div class="text-xs text-primary-500 mt-1 text-right">${timeString}</div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-white border border-primary-200 flex items-center justify-center mr-2 flex-shrink-0">
                    <i class="fas fa-robot text-primary-600 text-sm"></i>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-[80%] border border-primary-100">
                    <p class="text-gray-800">${text}</p>
                </div>
            </div>
            <div class="text-xs text-primary-500 mt-1 pl-10">${timeString}</div>
        `;
    }
    
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