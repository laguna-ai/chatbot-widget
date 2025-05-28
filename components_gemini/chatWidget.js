// chatWidget.js
import { toggleChatPopup, addMessageToChat } from './domUtils.js';
import { getOrGenerateSessionId, sendMessageToBot } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const chatToggleButton = document.getElementById('chat-toggle-button');
    const closeChatButton = document.getElementById('close-chat-button');
    const chatPopup = document.getElementById('chat-popup');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Configuración global
    const CHATBOT_API_URL = 'https://funciones-agente.azurewebsites.net/api/webhook?';
    let currentSessionId = getOrGenerateSessionId();
    let chatHistory = []; // Almacena el historial de conversación

    async function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Mostrar mensaje del usuario
        addMessageToChat(userMessage, true);
        chatInput.value = '';
        
        // Agregar mensaje de usuario al historial
        chatHistory.push({ role: "user", content: userMessage });
        
        // Mostrar indicador de "escribiendo"
        const typingIndicatorElement = addMessageToChat('', false, true);
        
        try {
            // Enviar mensaje con historial actual
            const { botMessage, updatedHistory } = await sendMessageToBot(
                userMessage, 
                currentSessionId, 
                CHATBOT_API_URL,
                chatHistory
            );
            
            // Actualizar historial con la respuesta del backend
            chatHistory = updatedHistory;
            
            // Remover indicador de "escribiendo"
            if (typingIndicatorElement) {
                chatMessages.removeChild(typingIndicatorElement);
            }
            
            // Mostrar respuesta del bot
            addMessageToChat(botMessage, false);
            
        } catch (error) {
            // Manejar errores
            if (typingIndicatorElement && chatMessages.contains(typingIndicatorElement)) {
                chatMessages.removeChild(typingIndicatorElement);
            }
            console.error('Error al enviar mensaje:', error);
            addMessageToChat('Error de conexión. Por favor, intenta de nuevo.', false);
        }
    }

    // Event Listeners
    chatToggleButton.addEventListener('click', () => toggleChatPopup(chatPopup, chatInput));
    closeChatButton.addEventListener('click', () => toggleChatPopup(chatPopup));
    
    sendButton.addEventListener('click', handleSendMessage);
    
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });

    // Animación inicial
    setTimeout(() => {
        chatToggleButton.classList.add('opacity-100', 'transform', 'scale-100');
        chatToggleButton.classList.remove('opacity-0', 'scale-90');
    }, 300);
    
    chatToggleButton.classList.add('opacity-0', 'scale-90', 'transition-all', 'duration-300', 'ease-out');
});