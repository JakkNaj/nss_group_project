import {useEffect} from "react";
import SockJS from "sockjs-client";
import { IMessage, Stomp } from "@stomp/stompjs";
import { ChatRoomStore } from "../stores/ChatRoomStore.ts";
import { MessageType } from "../model/types/MessageType.ts";
import { useChatLogStore } from "../stores/ChatLogStore.ts";
import { useStompClientStore } from "../stores/StompClientStore.ts";
import {UserType} from "../model/types/UserType.ts";

export const useChatConnection = (user : UserType | null) => {
	const { disconnectStompClient, setStompClient } = useStompClientStore();
	const { updateChatLogWithNewMessage } = useChatLogStore((state) => ({
		updateChatLogWithNewMessage: state.updateChatLogWithNewMessage,
	}));

	useEffect(() => {
		if (user) {
			const userId = user.id;
			console.warn("Connecting to websocket");
			const socket = new SockJS("http://localhost:8080/start-websocket-communication");
			const client = Stomp.over(socket);

			const subscribeToChat = () => {
				console.warn("Subscribing to chat");
				client.subscribe(`/userId/${userId}`, onMessageReceived);
				setStompClient(client);
			};

			client.connect({}, subscribeToChat, onError);

			return () => {
				// disconnect from websocket when component unmounts
				console.warn("component unmounted, disconnecting from websocket");
				disconnectStompClient();
			}
		} else {
			console.log("No user logged in.");
			return;
		}
	}, [user]);

	if (!user) {
		console.log("No user logged in.");
		return;
	}

	const onMessageReceived = (message: IMessage) => {
		console.warn("Received message");
		const payload = JSON.parse(message.body);

		const newMessage: MessageType = {
			id: payload.id,
			messageLogId: payload.messageLogId,
			senderId: payload.senderId,
			content: payload.content,
			timestampInSeconds: payload.timestampInSeconds,
			type: payload.type,
			messageReference: payload.messageReference,
		};

		console.log(newMessage);

		switch (newMessage.type) {
			case "JOIN":
				// Update the chat to indicate that a user has joined
				ChatRoomStore.addUserToChat(newMessage.messageLogId, newMessage.senderId);
				updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
				break;
			case "LEAVE":
				// Update the chat to indicate that a user has left
				if (newMessage.senderId === user.id) {
					ChatRoomStore.leaveChat(newMessage.messageLogId);
					updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
				}
				updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
				break;
			case "CHAT":
				updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
				break;
			case "REPLY":
				updateChatLogWithNewMessage(newMessage.messageLogId, newMessage);
				break;
			default:
				console.log(`Received unknown message type: ${newMessage.type}`);
				break;
		}
	};

	const onError = () => {
		console.log("Error: websocket error");
	};
};
