// domUtils.js
export function toggleChatPopup(chatPopup, chatInput = null) {
    chatPopup.classList.toggle('hidden');
    if (!chatPopup.classList.contains('hidden') && chatInput) {
        chatInput.focus();
    }
}

export function addMessageToChat(message, isUserMessage, isLoading = false) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('flex', 'mb-2');

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('py-2', 'px-3', 'rounded-lg', 'max-w-[80%]', 'shadow');

    if (isUserMessage) {
        messageWrapper.classList.add('justify-end');
        bubbleDiv.classList.add('bg-blue-500', 'text-white');
        bubbleDiv.innerHTML = `<p>${escapeHTML(message)}</p>`;
    } else if (isLoading) {
        messageWrapper.classList.add('justify-start', 'typing-indicator');
        bubbleDiv.classList.add('bg-gray-200', 'text-gray-500', 'italic');
        bubbleDiv.innerHTML = `
            <div class="flex items-center space-x-1">
                <span class="typing-indicator-dot h-2 w-2 bg-gray-400 rounded-full"></span>
                <span class="typing-indicator-dot h-2 w-2 bg-gray-400 rounded-full"></span>
                <span class="typing-indicator-dot h-2 w-2 bg-gray-400 rounded-full"></span>
            </div>`;
    } else {
        messageWrapper.classList.add('justify-start');
        bubbleDiv.classList.add('bg-gray-200', 'text-gray-800');
        bubbleDiv.innerHTML = `<p>${escapeHTML(message)}</p>`;
    }

    messageWrapper.appendChild(bubbleDiv);
    chatMessages.appendChild(messageWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageWrapper;
}

export function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            "'": '&#39;', '"': '&quot;'
        }[tag] || tag)
    );
}