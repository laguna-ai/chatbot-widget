// chatWidget.js
import { toggleChatPopup, addMessageToChat, escapeHTML } from './domUtils.js';
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

    async function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessageToChat(userMessage, true);
        chatInput.value = '';
        
        const typingIndicatorElement = addMessageToChat('', false, true);
        
        try {
            const botMessage = await sendMessageToBot(
                userMessage, 
                currentSessionId, 
                CHATBOT_API_URL
            );
            
            if (typingIndicatorElement) {
                chatMessages.removeChild(typingIndicatorElement);
            }
            
            addMessageToChat(botMessage, false);
        } catch (error) {
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