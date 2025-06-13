// chatWidget.js

import { getOrGenerateSessionId, sendMessageToBot } from './apiService.js';
import { addMessage, showTypingIndicator, hideTypingIndicator, initWidget } from './domUtils.js';

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
    
    // Estado
    let isChatOpen = false;
    let isTyping = false;
    let suggestionsVisible = false;
    let chatHistory = []; // Almacena el historial de la conversación
    const CHATBOT_API_URL = 'https://funciones-agente.azurewebsites.net/api/webhook';
    const sessionId = getOrGenerateSessionId(); // Obtener session ID
    
    const initialMessages = [
        '¡Bienvenido a tu experiencia Learnia! ¿Tienes dudas sobre el contenido, las actividades o la plataforma? Estoy para ti.',
        '¡Hola! ¿Listo para aprender? Puedo ayudarte con preguntas sobre tus cursos, evaluaciones o cómo avanzar más rápido.',
        '¡Hola! ¿Tienes preguntas sobre tu progreso, evaluaciones o próximas fechas clave? Pregúntame lo que quieras.'
    ];

    // Selecciona uno al azar
    const randomInitialMessage = initialMessages[Math.floor(Math.random() * initialMessages.length)];


    // Configuración
    const widgetConfig = {
        apiEndpoint: CHATBOT_API_URL,
        initialMessage: randomInitialMessage
    };
    
    // Inicializar widget
    initWidget(widgetConfig);
    
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
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '' || isTyping) return;
        
        // Add user message to chat
        addMessage(message, 'user', chatMessages);
        userInput.value = '';
        
        // Hide suggestions if visible
        if (suggestionsVisible) {
            quickSuggestions.classList.add('hidden');
            suggestionsVisible = false;
            suggestionsToggle.innerHTML = '<i class="fas fa-lightbulb mr-1"></i> Sugerencias';
        }
        
        // Show typing indicator
        isTyping = true;
        showTypingIndicator(typingIndicator, chatMessages);
        
        try {
            // Send message to API
            const { botMessage, updatedHistory } = await sendMessageToBot(
                message, 
                sessionId, 
                CHATBOT_API_URL, 
                chatHistory
            );
            
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
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userInput.value = this.textContent.trim();
            userInput.focus();
        });
    });
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});