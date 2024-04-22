import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {IMessage, Stomp} from '@stomp/stompjs';
import { CompatClient } from '@stomp/stompjs';
import {ChatStore} from "../stores/ChatStore.ts";
import { MessageType } from "../model/types/MessageType.ts";
import {EChatType} from "../model/enums/EChatType.ts";

interface UseChatProps {
  username: string;
  chatId: number;
}

export const useChat = ({ username, chatId }: UseChatProps) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);

  useEffect(() => {
    if (username && chatId) {
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
      setStompClient(client);
    }
  }, [username, chatId]);

  interface SendMessageProps {
    content: string;
  }

  const sendMessage = ({ content }: SendMessageProps) => {
    if (content && stompClient) {
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({
        messageLogId: chatId,
        sender: username,
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
      text: payload.content,
      timestamp: payload.timestampInSeconds,
      type: payload.type,
    };
    const chat = ChatStore.findChat(chatId);
    if (chat) {
      if (chat.type === EChatType.DIRECT) {
        ChatStore.updateDirectChatWithNewMessage(chatId, newMessage);
      } else if (chat.type === EChatType.GROUP) {
        ChatStore.updateGroupChatWithNewMessage(chatId, newMessage);
      }
    }
  };

  const onError = () => {
    // Handle error
  };

  return { sendMessage };
};