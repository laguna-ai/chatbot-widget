document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const suggestionsToggle = document.getElementById('suggestions-toggle');
    const quickSuggestions = document.getElementById('quick-suggestions');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    // State
    let isChatOpen = false;
    let isTyping = false;
    let suggestionsVisible = false;
    
    // Toggle Chat Window
    chatbotToggle.addEventListener('click', function() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatbotWindow.classList.remove('hidden');
            chatbotToggle.innerHTML = '<i class="fas fa-times text-2xl"></i>';
            chatbotToggle.classList.remove('bg-primary-600', 'hover:bg-primary-700');
            chatbotToggle.classList.add('bg-secondary-600', 'hover:bg-secondary-700');
            // Focus input when opening
            setTimeout(() => userInput.focus(), 300);
        } else {
            chatbotWindow.classList.add('hidden');
            chatbotToggle.innerHTML = '<i class="fas fa-comment-dots text-2xl"></i>';
            chatbotToggle.classList.remove('bg-secondary-600', 'hover:bg-secondary-700');
            chatbotToggle.classList.add('bg-primary-600', 'hover:bg-primary-700');
        }
    });
    
    // Close Chat
    closeChat.addEventListener('click', function() {
        chatbotWindow.classList.add('hidden');
        isChatOpen = false;
        chatbotToggle.innerHTML = '<i class="fas fa-comment-dots text-2xl"></i>';
        chatbotToggle.classList.remove('bg-secondary-600', 'hover:bg-secondary-700');
        chatbotToggle.classList.add('bg-primary-600', 'hover:bg-primary-700');
    });
    
    // Minimize Chat
    minimizeChat.addEventListener('click', function() {
        chatbotWindow.classList.add('hidden');
        isChatOpen = false;
        chatbotToggle.innerHTML = '<i class="fas fa-comment-dots text-2xl"></i>';
        chatbotToggle.classList.remove('bg-secondary-600', 'hover:bg-secondary-700');
        chatbotToggle.classList.add('bg-primary-600', 'hover:bg-primary-700');
    });
    
    // Toggle Quick Suggestions
    suggestionsToggle.addEventListener('click', function() {
        suggestionsVisible = !suggestionsVisible;
        if (suggestionsVisible) {
            quickSuggestions.classList.remove('hidden');
            suggestionsToggle.innerHTML = '<i class="fas fa-chevron-up mr-1"></i> Ocultar';
        } else {
            quickSuggestions.classList.add('hidden');
            suggestionsToggle.innerHTML = '<i class="fas fa-lightbulb mr-1"></i> Sugerencias';
        }
    });
    
    // Send Message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '' || isTyping) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Hide suggestions if visible
        if (suggestionsVisible) {
            quickSuggestions.classList.add('hidden');
            suggestionsVisible = false;
            suggestionsToggle.innerHTML = '<i class="fas fa-lightbulb mr-1"></i> Sugerencias';
        }
        
        // Show typing indicator
        isTyping = true;
        typingIndicator.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            typingIndicator.classList.add('hidden');
            isTyping = false;
            
            // This is where you would call your Azure Function API
            // For now, we'll simulate a response
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
    
    // Add Message to Chat
    function addMessage(text, sender) {
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
    
    // Handle suggestion button clicks
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userInput.value = this.textContent.trim();
            userInput.focus();
        });
    });
    
    // Simple bot response logic (replace with API call)
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas tardes')) {
            return '¡Hola! ¿En qué puedo ayudarte hoy?';
        } else if (lowerMessage.includes('gracias')) {
            return '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?';
        } else if (lowerMessage.includes('adiós') || lowerMessage.includes('chao') || lowerMessage.includes('hasta luego')) {
            return '¡Hasta luego! No dudes en volver si necesitas más ayuda.';
        } else if (lowerMessage.includes('precio') || lowerMessage.includes('coste') || lowerMessage.includes('costo')) {
            return 'Nuestros precios varían según el producto o servicio. ¿Podrías especificar a cuál te refieres?';
        } else if (lowerMessage.includes('horario') || lowerMessage.includes('horarios') || lowerMessage.includes('abierto')) {
            return 'Nuestro horario de atención es de lunes a viernes de 9:00 am a 6:00 pm. ¿Necesitas información más específica?';
        } else if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('email')) {
            return 'Puedes contactarnos al teléfono +123456789 o al correo info@tuempresa.com. ¿Quieres que te proporcione más detalles?';
        } else if (lowerMessage.includes('producto') || lowerMessage.includes('servicio')) {
            return 'Tenemos una amplia gama de productos y servicios. ¿Podrías decirme qué tipo de producto o servicio te interesa?';
        } else if (lowerMessage.includes('soporte') || lowerMessage.includes('técnico') || lowerMessage.includes('ayuda')) {
            return 'Para soporte técnico, puedes contactar a nuestro equipo al correo soporte@tuempresa.com o llamar al +123456789 opción 2.';
        } else {
            return 'Entiendo que quieres saber sobre: "' + message + '". Actualmente estoy aprendiendo. ¿Podrías reformular tu pregunta o consultar nuestro sitio web?';
        }
    }
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Configuration options (can be set when embedding the widget)
    window.chatbotWidgetConfig = {
        apiEndpoint: 'https://your-azure-function.azurewebsites.net/api/webhook',
        initialMessage: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        brandName: 'TuEmpresa',
        primaryColor: '#0ea5e9', // primary-500
        secondaryColor: '#7c3aed', // secondary-600
        suggestions: [
            '¿Cuáles son sus horarios?',
            '¿Cómo contactarlos?',
            'Información de productos',
            'Soporte técnico'
        ]
    };
    
    // Initialize with config
    function initWidget(config) {
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
        
        // You would need more complex logic to dynamically update colors
        // This is a simplified version
        if (config.primaryColor) {
            document.documentElement.style.setProperty('--color-primary-500', config.primaryColor);
        }
        
        if (config.secondaryColor) {
            document.documentElement.style.setProperty('--color-secondary-600', config.secondaryColor);
        }
    }
    
    // Initialize with default or provided config
    initWidget(window.chatbotWidgetConfig || {});
});