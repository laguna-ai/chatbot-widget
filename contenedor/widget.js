// widget/widget.js

import { getOrGenerateSessionId, sendMessageToBot } from './apiService.js';
import { addMessage, showTypingIndicator, hideTypingIndicator, initWidget } from './domUtils.js';

export function initializeWidget() {
    // DOM Elements
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const suggestionsToggle = document.getElementById('suggestions-toggle');
    const quickSuggestions = document.getElementById('quick-suggestions');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    const resetSessionBtn = document.getElementById('reset-session');

    // Estado
    let isTyping = false;
    let suggestionsVisible = false;
    let chatHistory = [];
    const CHATBOT_API_URL = 'https://server-funcs.azurewebsites.net/api/webhook';
    const startTime = performance.now();
    const sessionId = getOrGenerateSessionId();
    const endTime = performance.now();
    console.log(`getOrGenerateSessionId runtime: ${endTime - startTime} ms`);
    
    const initialMessages = [
        'Hola, soy MentIA, tu mentor virtual en Learnia Academy. ¡Bienvenido a tu experiencia de aprendizaje! ¿Tienes dudas sobre el contenido, las actividades o la plataforma? Estoy para ti.',
        'Hola, soy MentIA, tu mentor virtual en Learnia Academy. ¿Listo para aprender? Puedo ayudarte con preguntas sobre tus cursos, evaluaciones o cómo avanzar más rápido.',
        'Hola, soy MentIA, tu mentor virtual en Learnia Academy. ¿Tienes preguntas sobre tu progreso, evaluaciones o próximas fechas clave? Pregúntame lo que quieras.'
    ];

    // Selecciona uno al azar
    const randomInitialMessage = initialMessages[Math.floor(Math.random() * initialMessages.length)];


    // Configuración
    const widgetConfig = {
        apiEndpoint: CHATBOT_API_URL,
        initialMessage:  randomInitialMessage
    };
    
    // Inicializar widget
    initWidget(widgetConfig);
    
    // Close Chat
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            alert('Función de cerrar implementada en la versión completa');
        });
    }
    
    // Minimize Chat
    if (minimizeChat) {
        minimizeChat.addEventListener('click', function() {
            alert('Función de minimizar implementada en la versión completa');
        });
    }
    
    // Reset Session
    if (resetSessionBtn) {
        resetSessionBtn.addEventListener('click', function () {
            sessionStorage.removeItem('chatbotSessionId');
            location.reload(); // Opcional: recarga para reiniciar todo
        });
    }


    // Toggle Quick Suggestions
    if (suggestionsToggle) {
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
    }
    
    // Send Message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '' || isTyping) return;
        
        // Add user message to chat
        addMessage(message, 'user', chatMessages);
        userInput.value = '';
        
        // Hide suggestions if visible
        if (suggestionsVisible && quickSuggestions) {
            quickSuggestions.classList.add('hidden');
            suggestionsVisible = false;
            suggestionsToggle.innerHTML = '<i class="fas fa-lightbulb mr-1"></i> Sugerencias';
        }
        
        // Show typing indicator
        isTyping = true;
        showTypingIndicator(typingIndicator, chatMessages);
        
        try {
            // Send message to API
            const startApiCall = performance.now();
            const { botMessage, updatedHistory } = await sendMessageToBot(
                message, 
                sessionId, 
                CHATBOT_API_URL, 
                chatHistory
            );
            const endApiCall = performance.now();
            console.log(`sendMessageToBot runtime: ${endApiCall - startApiCall} ms`);
            
            // Update chat history
            chatHistory = updatedHistory;
            
            // Add bot response to chat
            addMessage(botMessage, 'bot', chatMessages);
            
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Error de conexión. Por favor, intenta de nuevo.', 'bot', chatMessages);
        } finally {
            // Hide typing indicator
            hideTypingIndicator(typingIndicator);
            isTyping = false;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Handle suggestion button clicks
    if (suggestionBtns.length > 0) {
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (userInput) {
                    userInput.value = this.textContent.trim();
                    userInput.focus();
                }
            });
        });
    }
    
    // Event Listeners
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}