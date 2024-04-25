'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var userId = null;
var chatId = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

let connect = (event) => {

    chatId = document.querySelector('#chatId').value.trim();
    userId = document.querySelector('#userId').value.trim();
    console.log("USER ID: " + userId + " CHAT ID: " + chatId)
    if(userId && chatId) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        let stateInfoH2 = document.querySelector('#state-info');
        stateInfoH2.innerHTML = `Chat ID: ${chatId} | User: ${userId}`;
        var socket = new SockJS('http://localhost:8080/start-websocket-communication');

        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);

    }
    event.preventDefault();
}
usernameForm.addEventListener('submit', connect, true);

let onConnected = () => {
    if (chatId) {
        renderChatHistory();
        subscribeToChat(chatId);
    }
}

let subscribeToChat = (chatId) => {
    stompClient.subscribe(`/userId/${userId}`, onMessageReceived);
    console.log(`SUBSCRIBING TO CHAT /userId/${userId}`)

    var chatMessage = {
        messageLogId: chatId,
        senderId: userId,
        content: null,
        type: 'JOIN',
        timestampInSeconds: Math.floor(Date.now() / 1000)
    };

    stompClient.send("/app/chat/addUser",
        {},
        JSON.stringify(chatMessage)
    );

    connectingElement.classList.add('hidden');
}

let renderChatHistory = async () => {
    // Make a GET request using Fetch API
    fetch(`http://localhost:8080/chat-history?chatId=${chatId}`)
        .then(response => {
            // Check if the response was successful (status 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response
            return response.json();
        })
        .then(data => {
            console.log('Fetch successful:', data)
            for (let message of data.messages) {
                onMessageReceived({body: JSON.stringify(message)});
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Fetch error:', error);
        });
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

messageForm.addEventListener('submit', sendMessage, true);

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    console.log("USER ID: " + userId + " CHAT ID: " + chatId + " MESSAGE: " + messageContent);

    if(messageContent && stompClient) {
        var chatMessage = {
            messageLogId: chatId,
            senderId: userId,
            content: messageInput.value,
            type: 'CHAT',
            timestampInSeconds: Math.floor(Date.now() / 1000)
        };

        stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.senderId + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.senderId + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.senderId);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.senderId);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.senderId);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    var index = Math.abs(messageSender % colors.length);
    return colors[index];
}