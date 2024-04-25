import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {IMessage, Stomp} from '@stomp/stompjs';
import { CompatClient } from '@stomp/stompjs';
import {ChatRoomStore} from "../stores/ChatRoomStore.ts";
import { MessageType } from "../model/types/MessageType.ts";
import {useChatLogStore} from "../stores/ChatLogStore.ts";

export const useChat = ({ userId }: { userId: number }) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const { updateChatLogWithNewMessage, activeChatLog } = useChatLogStore((state) => ({
    updateChatLogWithNewMessage: state.updateChatLogWithNewMessage,
    activeChatLog: state.activeChatLog,
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

  const sendMessage = ({ content, chatId, type='CHAT' }: { content: string; chatId: number; type?: string }) => {
    if (!activeChatLog) {
      console.error('No active chat log, cannot send message!');
    }
    else if (content && chatId && stompClient?.connected) {
      stompClient.send(`/app/user.sendMessage/${chatId}`, {}, JSON.stringify({
        messageLogId: activeChatLog.id,
        senderId: userId,
        content: content,
        type: type,
        timestampInSeconds: Math.floor(Date.now() / 1000)
      }));
    }
  };

  const onMessageReceived = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    const newMessage: MessageType = {
      messageLogId: payload.messageLogId,
      idSender: payload.sender,
      content: payload.content,
      timestamp: payload.timestampInSeconds,
      type: payload.type,
    };

    switch (newMessage.type) {
      case 'JOIN':
        // Update the chat to indicate that a user has joined
        ChatRoomStore.addUserToChat(newMessage.messageLogId, newMessage.idSender);
        updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
        break;
      case 'LEAVE':
        // Update the chat to indicate that a user has left
        ChatRoomStore.removeUserFromChat(newMessage.messageLogId, newMessage.idSender);
        updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
        break;
      case 'CHAT':
        updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
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