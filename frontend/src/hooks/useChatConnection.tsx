import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import {IMessage, Stomp} from '@stomp/stompjs';
import {ChatRoomStore} from "../stores/ChatRoomStore.ts";
import { MessageType } from "../model/types/MessageType.ts";
import {useChatLogStore} from "../stores/ChatLogStore.ts";
import {useStompClientStore} from "../stores/StompClientStore.ts";

export const useChatConnection = ({ userId }: { userId: number }) => {
    const { setStompClient } = useStompClientStore();
    const { updateChatLogWithNewMessage } = useChatLogStore((state) => ({
        updateChatLogWithNewMessage: state.updateChatLogWithNewMessage,
    }));

    useEffect(() => {
        console.warn("called useEffect in useChatConnection")
        if (userId) {
            console.warn('Connecting to websocket')
            const socket = new SockJS('http://localhost:8080/start-websocket-communication');
            const client = Stomp.over(socket);

            const subscribeToChat = () => {
                console.warn("Subscribing to chat");
                client.subscribe(`/userId/${userId}`, onMessageReceived);
                setStompClient(client);
            }

            client.connect({},subscribeToChat, onError);
        }

    }, []);

    const onMessageReceived = (message: IMessage) => {
        console.warn('Received message')
        const payload = JSON.parse(message.body);
        const newMessage: MessageType = {
            messageLogId: payload.messageLogId,
            senderId: payload.senderId,
            content: payload.content,
            timestampInSeconds: payload.timestampInSeconds,
            type: payload.type,
        };

        console.log(newMessage);

        switch (newMessage.type) {
            case 'JOIN':
                // Update the chat to indicate that a user has joined
                ChatRoomStore.addUserToChat(newMessage.messageLogId, newMessage.senderId);
                updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
                break;
            case 'LEAVE':
                // Update the chat to indicate that a user has left
                ChatRoomStore.removeUserFromChat(newMessage.messageLogId, newMessage.senderId);
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

};