
import { getOrGenerateSessionId, sendMessageToBotStream, updateHistoryOnBackend } from "./apiService.js";
import { addMessage, initWidget, createStreamingMessageElement, updateMessageElement, finalizeMessageElement } from "./domUtils.js";

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const closeChat = document.getElementById("close-chat");
    const minimizeChat = document.getElementById("minimize-chat");
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const suggestionsToggle = document.getElementById("suggestions-toggle");
    const quickSuggestions = document.getElementById("quick-suggestions");
    const suggestionBtns = document.querySelectorAll(".suggestion-btn");
    const resetSessionBtn = document.getElementById("reset-session");

    // Limpiar sessionId al refrescar la página
    sessionStorage.removeItem("chatbotSessionId");

    // Estado
    let isChatOpen = false;
    let isTyping = false;
    let suggestionsVisible = false;
    let chatHistory = [];
    const CHATBOT_API_URL = "https://server-funcs.azurewebsites.net/api/webhook?";
    const startTime = performance.now();
    let sessionId = getOrGenerateSessionId();
    const endTime = performance.now();
    console.log(`getOrGenerateSessionId runtime: ${endTime - startTime} ms`);

    const initialMessages = [
        "Hola, soy MentIA, tu mentor virtual en Learnia Academy. ¡Bienvenido a tu experiencia de aprendizaje! ¿Tienes dudas sobre el contenido, las actividades o la plataforma? Estoy para ti.",
        "Hola, soy MentIA, tu mentor virtual en Learnia Academy. ¿Listo para aprender? Puedo ayudarte con preguntas sobre tus cursos, evaluaciones o cómo avanzar más rápido.",
        "Hola, soy MentIA, tu mentor virtual en Learnia Academy. ¿Tienes preguntas sobre tu progreso, evaluaciones o próximas fechas clave? Pregúntame lo que quieras."
    ];
    const randomInitialMessage = initialMessages[Math.floor(Math.random() * initialMessages.length)];

    // Configuración del widget
    const widgetConfig = {
        apiEndpoint: CHATBOT_API_URL,
        initialMessage: randomInitialMessage
    };

    // Inicializar widget
    initWidget(widgetConfig);

    // Toggle Chat Window
    chatbotToggle.addEventListener("click", function () {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatbotWindow.classList.remove("hidden");
            chatbotToggle.innerHTML = '<i class="fas fa-times text-2xl"></i>';
            chatbotToggle.classList.remove("bg-primary-600", "hover:bg-primary-700");
            chatbotToggle.classList.add("bg-secondary-600", "hover:bg-secondary-700");
            setTimeout(() => userInput.focus(), 300);
        } else {
            chatbotWindow.classList.add("hidden");
            chatbotToggle.innerHTML = '<i class="fas fa-comment-dots text-2xl"></i>';
            chatbotToggle.classList.remove("bg-secondary-600", "hover:bg-secondary-700");
            chatbotToggle.classList.add("bg-primary-600", "hover:bg-primary-700");
        }
    });

    // Cerrar chat
    if (closeChat) {
        closeChat.addEventListener("click", function () {
            alert("Función de cerrar implementada en la versión completa");
        });
    }

    // Minimizar chat
    if (minimizeChat) {
        minimizeChat.addEventListener("click", function () {
            alert("Función de minimizar implementada en la versión completa");
        });
    }

    // Resetear sesión
    if (resetSessionBtn) {
        resetSessionBtn.addEventListener("click", function () {
            sessionStorage.removeItem("chatbotSessionId");
            sessionId = getOrGenerateSessionId();
            chatHistory = [];
            if (chatMessages) chatMessages.innerHTML = "";
            addMessage(widgetConfig.initialMessage, "assistant", chatMessages);
            isChatOpen = true;
            chatbotWindow.classList.remove("hidden");
            chatbotToggle.innerHTML = '<i class="fas fa-times text-2xl"></i>';
            chatbotToggle.classList.remove("bg-primary-600", "hover:bg-primary-700");
            chatbotToggle.classList.add("bg-secondary-600", "hover:bg-secondary-700");
            setTimeout(() => userInput.focus(), 300);
        });
    }

    // Toggle sugerencias rápidas
    if (suggestionsToggle) {
        suggestionsToggle.addEventListener("click", function () {
            suggestionsVisible = !suggestionsVisible;
            if (suggestionsVisible) {
                quickSuggestions.classList.remove("hidden");
                suggestionsToggle.innerHTML = '<i class="fas fa-chevron-up mr-1"></i> Ocultar';
            } else {
                quickSuggestions.classList.add("hidden");
                suggestionsToggle.innerHTML = '<i class="fas fa-lightbulb mr-1"></i> Sugerencias';
            }
        });
    }

    // Enviar mensaje
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "" || isTyping) return;

        addMessage(message, "user", chatMessages);
        userInput.value = "";

        // Ocultar sugerencias si están visibles
        if (suggestionsVisible && quickSuggestions) {
            quickSuggestions.classList.add("hidden");
            suggestionsVisible = false;
            suggestionsToggle.innerHTML = '<i class="fas fa-lightbulb mr-1"></i> Sugerencias';
        }

        isTyping = true;
        // No hay typingIndicator en la versión minificada, así que se omite

        // Crear contenedor para mensaje streaming
        const messageId = `msg-${Date.now()}`;
        const streamingMessage = createStreamingMessageElement(messageId);
        chatMessages.appendChild(streamingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        let fullResponse = "";

        sendMessageToBotStream(
            message,
            sessionId,
            CHATBOT_API_URL,
            chatHistory,
            (chunk) => {
                fullResponse += chunk;
                updateMessageElement(messageId, chunk);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            },
            () => {
                finalizeMessageElement(messageId, fullResponse);
                chatHistory.push({ role: "user", content: message });
                chatHistory.push({ role: "assistant", content: fullResponse });
                updateHistoryOnBackend(sessionId, chatHistory);
                isTyping = false;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            },
            (error) => {
                updateMessageElement(messageId, "❌ Error en la conexión");
                console.error("Streaming error:", error);
                isTyping = false;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        );
    }

    // Sugerencias rápidas
    if (suggestionBtns.length > 0) {
        suggestionBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                if (userInput) {
                    userInput.value = this.textContent.trim();
                    userInput.focus();
                }
            });
        });
    }

    // Listeners
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }
    if (userInput) {
        userInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
});