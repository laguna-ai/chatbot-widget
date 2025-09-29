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

export function sendMessageToBotStream(userMessage, sessionId, apiUrl, chatHistory, onChunk, onComplete, onError, userName) {
    const sessionPath = `projects/YOUR_PROJECT_ID/locations/us-central1/agents/YOUR_AGENT_ID/sessions/${sessionId}`;
    
    // Construir el payload según la nueva estructura
    const requestPayload = {
        sessionInfo: {
            session: sessionPath,
            parameters: { userName: userName }
        },
        text: userMessage
    };

    // Si hay historial, lo incluimos en los parámetros
    if (chatHistory.length > 0) {
        requestPayload.sessionInfo.parameters.context = chatHistory;
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        function processStream({ done, value }) {
            if (done) {
                onComplete();
                return;
            }
            
            buffer += decoder.decode(value, { stream: true });
            
            let eventEndIndex;
            while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
                const eventData = buffer.substring(0, eventEndIndex);
                buffer = buffer.substring(eventEndIndex + 2);
                
                if (eventData.startsWith('data: ')) {
                    const chunk = eventData.replace('data: ', '');
                    onChunk(chunk);
                }
            }
            
            return reader.read().then(processStream);
        }
        
        return reader.read().then(processStream);
    })
    .catch(error => {
        onError(error);
    });
}

const UPDATE_HISTORY_URL = "https://aux-funcs.azurewebsites.net/api/update_history?"

// Función para actualizar el historial en el backend
export function updateHistoryOnBackend(sessionId, history, userName) {
    fetch(UPDATE_HISTORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            session_id: sessionId,
            history: history,
            userName: userName
        })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error updating history:', response.status);
        }
    })
    .catch(error => {
        console.error('Failed to update history:', error);
    });
}