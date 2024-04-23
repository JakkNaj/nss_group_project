import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {IMessage, Stomp} from '@stomp/stompjs';
import { CompatClient } from '@stomp/stompjs';
import {ChatStore} from "../stores/ChatStore.ts";
import { MessageType } from "../model/types/MessageType.ts";

interface UseChatProps {
  username: string;
  chatIds: number[];
}

export const useChat = ({ username, chatIds }: UseChatProps) => {
  const [stompClients, setStompClients] = useState<CompatClient[]>([]);
  const { updateChatWithNewMessage } = ChatStore.useStore((state) => ({
    updateChatWithNewMessage: state.updateChatWithNewMessage,
  }));

  useEffect(() => {
    if (username && chatIds.length > 0) {
      const clients = chatIds.map(chatId => {
        const socket = new SockJS('http://localhost:8080/start-websocket-communication');
        const client = Stomp.over(socket);
        client.connect({}, () => {
          client.subscribe(`/topic/${chatId}`, onMessageReceived);
          client.send("/app/chat.addUser", {}, JSON.stringify({
            messageLogId: chatId,
            sender: username,
            content: null,
            type: 'JOIN',
            timestampInSeconds: Math.floor(Date.now() / 1000)
          }));
        }, onError);
        return client;
      });
      setStompClients(clients);
    }
  }, [username, chatIds]);

  interface SendMessageProps {
    content: string;
    chatId: number;
  }

  const sendMessage = ({ content, chatId }: SendMessageProps) => {
    if (content ) {
      const stompClient = stompClients.find(client => client.connected);
      if (stompClient) {
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({
          messageLogId: chatId,
          sender: username,
          content: content,
          type: 'CHAT',
          timestampInSeconds: Math.floor(Date.now() / 1000)
        }));
      }
    }
  };

  const onMessageReceived = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    const newMessage: MessageType = {
      idSender: payload.sender,
      text: payload.content,
      timestamp: payload.timestampInSeconds,
      type: payload.type,
    };
    const chatId = payload.messageLogId;
    const chat = ChatStore.findChat(chatId);
    if (chat) {
      updateChatWithNewMessage(chatId, newMessage);
    }
  };

  const onError = () => {
    console.log('Error: websocket error');
  };

  return { sendMessage };
};