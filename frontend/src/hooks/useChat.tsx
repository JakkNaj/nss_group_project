import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {IMessage, Stomp} from '@stomp/stompjs';
import { CompatClient } from '@stomp/stompjs';
import {ChatStore} from "../stores/ChatStore.ts";
import { MessageType } from "../model/types/MessageType.ts";

export const useChat = ({ userId }: { userId: number }) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const { updateChatWithNewMessage } = ChatStore.useStore((state) => ({
    updateChatWithNewMessage: state.updateChatWithNewMessage,
  }));

  useEffect(() => {
    if (userId) {
      const socket = new SockJS('http://localhost:8080/start-websocket-communication');
      const client = Stomp.over(socket);
      client.connect({}, () => {
        client.subscribe(`/userId/${userId}`, onMessageReceived);
        client.send("/app/user.addUser", {}, JSON.stringify({
          senderId: userId,
          type: 'JOIN',
          timestampInSeconds: Math.floor(Date.now() / 1000)
        }));
        setStompClient(client);
      }, onError);
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [userId]);

  const sendMessage = ({ content, recipient }: { content: string; recipient: string }) => {
    if (content && recipient && stompClient?.connected) {
      stompClient.send(`/app/user.sendMessage/${recipient}`, {}, JSON.stringify({
        senderId: userId,
        content: content,
        type: 'CHAT',
        timestampInSeconds: Math.floor(Date.now() / 1000)
      }));
    }
  };

  const onMessageReceived = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    const newMessage: MessageType = {
      idSender: payload.sender,
      content: payload.content,
      timestamp: payload.timestampInSeconds,
      type: payload.type,
    };
    const chatId = payload.messageLogId; //todo add message log to each chat

    switch (newMessage.type) {
      case 'JOIN':
        // Update the chat to indicate that a user has joined
        ChatStore.addUserToChat(chatId, newMessage.idSender);
        updateChatWithNewMessage(chatId, newMessage);
        break;
      case 'LEAVE':
        // Update the chat to indicate that a user has left
        ChatStore.removeUserFromChat(chatId, newMessage.idSender);
        updateChatWithNewMessage(chatId, newMessage);
        break;
      case 'CHAT':
        updateChatWithNewMessage(chatId, newMessage);
        break;
      default:
        console.log(`Received unknown message type: ${newMessage.type}`);
        break;
    }
  };

  const onError = () => {
    console.log('Error: websocket error');
  };

  return { sendMessage };
};