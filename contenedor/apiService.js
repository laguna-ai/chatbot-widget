// apiService.js

export function getOrGenerateSessionId() {
    let sessionId = sessionStorage.getItem('chatbotSessionId');
    if (!sessionId) {
        sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        sessionStorage.setItem('chatbotSessionId', sessionId);
    }
    return sessionId;
}

export async function sendMessageToBot(userMessage, sessionId, apiUrl, chatHistory = []) {
    // Construir la sesión en el formato que espera Dialogflow
    const sessionPath = `projects/YOUR_PROJECT_ID/locations/us-central1/agents/YOUR_AGENT_ID/sessions/${sessionId}`;
    
    // Construir el payload según la nueva estructura
    const requestPayload = {
        sessionInfo: {
            session: sessionPath,
            parameters: {}
        },
        text: userMessage
    };

    // Si hay historial, lo incluimos en los parámetros
    if (chatHistory.length > 0) {
        requestPayload.sessionInfo.parameters.context = chatHistory;
    }

    try {
        const startTime = performance.now();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        });

        const endTime = performance.now();
        const runtime = endTime - startTime;
        console.log(`Neat (Azure) API call runtime: ${runtime.toFixed(2)} ms`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const jsonStartTime = performance.now();
        const data = await response.json();
        const jsonEndTime = performance.now();
        const jsonRuntime = jsonEndTime - jsonStartTime;
        console.log(`JSON parsing runtime: ${jsonRuntime.toFixed(2)} ms`);
        
        // Extraer la respuesta del bot
        let botMessage = "No se pudo obtener una respuesta válida";
        if (data.fulfillmentResponse?.messages?.length > 0) {
            const firstMessage = data.fulfillmentResponse.messages[0];
            if (firstMessage.text?.text?.length > 0) {
                botMessage = firstMessage.text.text[0];
            }
        }
        
        // Extraer el historial actualizado
        let updatedHistory = chatHistory;
        if (data.sessionInfo?.parameters?.context) {
            updatedHistory = data.sessionInfo.parameters.context;
        } else {
            // Si no viene historial actualizado, agregamos el nuevo mensaje manualmente
            updatedHistory = [
                ...chatHistory,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: botMessage }
            ];
        }
        
        return {
            botMessage,
            updatedHistory
        };
        
    } catch (error) {
        console.error('Error in sendMessageToBot:', error);
        return {
            botMessage: 'Error de conexión. Por favor, intenta de nuevo.',
            updatedHistory: chatHistory
        };
    }
}