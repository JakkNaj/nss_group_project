import { useStompClientStore } from "../stores/StompClientStore.ts";
import { UserStore } from "../stores/UserStore.ts";
import {useEffect, useState} from "react";

export const useSendMessage = () => {
	const [senderId, setSenderId] = useState<number>(-1);
	const stompClient = useStompClientStore((state) => state.stompClient);

	const user = UserStore.getLoggedInUser();

	useEffect(() => {
		if (user) {
			setSenderId(user.id);
		}
	}, []);

	if (senderId <= 0) {
		return { sendMessage: () => {} };
	}

	const sendMessage = ({ content, chatLogId, type = "CHAT" }: { content: string | null; chatLogId: number; type?: string }) => {
		if (stompClient?.connected) {
			console.warn("Sending message through websocket")
			const chatMessage = {
				messageLogId: chatLogId,
				senderId: senderId,
				content: content,
				type: type,
				timestampInSeconds: Math.floor(Date.now() / 1000),
			};

			console.log(chatMessage);

			stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
		}
	};

	return { sendMessage };
};
