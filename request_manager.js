async function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            addMessageToChat(userMessage, true);
            // Actualizar el historial simple para la API (opcional, depende de `prepare_history`)
            // chatHistoryForApi.push({ speaker: "USER", text: userMessage }); 

            chatInput.value = '';
            const typingIndicatorElement = addMessageToChat('', false, true); // Mostrar indicador de "escribiendo"

            // Construir el payload para la API de Azure Function
            // Esto asume que tu API espera una estructura similar a la de Dialogflow
            const requestPayload = {
                session: `projects/YOUR_PROJECT_ID/agent/sessions/${currentSessionId}`, // Formato típico de Dialogflow para session ID
                                                                                       // O simplemente `currentSessionId` si tu `get_personal_info` lo maneja así.
                                                                                       // ¡DEBES AJUSTAR ESTO!
                queryInput: {
                    text: {
                        text: userMessage,
                        languageCode: 'es' // Ajusta según sea necesario
                    }
                }
                // Si `prepare_history` espera el historial en el request:
                // ,webhookState: { // o un campo similar que use tu `prepare_history`
                //    history: chatHistoryForApi 
                // }
            };
            
            // Si tu `get_personal_info` es más simple y solo espera `prompt` y `session_id` directamente:
            /*
            const requestPayload = {
                prompt: userMessage,
                session_id: currentSessionId
                // y cualquier otra cosa que `prepare_history` pueda necesitar del request_json
            };
            */


            try {
                const response = await fetch(CHATBOT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Si tu Azure Function está protegida por una clave de API (Function Key):
                        // 'x-functions-key': 'TU_AZURE_FUNCTION_KEY' 
                    },
                    body: JSON.stringify(requestPayload)
                });

                if (typingIndicatorElement) {
                    chatMessages.removeChild(typingIndicatorElement); // Remover indicador
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error de API:', response.status, errorText);
                    addMessageToChat(`Error del asistente (Código: ${response.status}). Intenta más tarde.`, false);
                    return;
                }

                const data = await response.json();
                
                // Extraer la respuesta del bot. Esto depende de cómo `create_webhook_response` formatea la salida.
                // Asumiendo formato Dialogflow:
                let botMessage = "No se pudo obtener una respuesta."; // Mensaje por defecto
                if (data.fulfillmentMessages && data.fulfillmentMessages.length > 0) {
                    const firstMessage = data.fulfillmentMessages[0];
                    if (firstMessage.text && firstMessage.text.text && firstMessage.text.text.length > 0) {
                        botMessage = firstMessage.text.text.join('\n'); // Unir si hay múltiples líneas de texto
                    }
                } else if (data.reply) { // Si tu API devuelve un campo 'reply' simple
                    botMessage = data.reply;
                } else if (data.fulfillmentText) { // Otro formato común de Dialogflow
                     botMessage = data.fulfillmentText;
                }
                // ... puedes añadir más `else if` para otros posibles formatos de tu API.

                addMessageToChat(botMessage, false);
                // Actualizar el historial simple para la API (opcional)
                // chatHistoryForApi.push({ speaker: "BOT", text: botMessage });

            } catch (error) {
                if (typingIndicatorElement && chatMessages.contains(typingIndicatorElement)) {
                    chatMessages.removeChild(typingIndicatorElement);
                }
                console.error('Error al enviar mensaje:', error);
                addMessageToChat('Error de conexión. Por favor, revisa tu conexión e intenta de nuevo.', false);
            }
        }