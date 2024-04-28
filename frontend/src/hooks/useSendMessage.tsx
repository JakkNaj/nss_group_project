import { useStompClientStore } from "../stores/StompClientStore.ts";
import { UserStore } from "../stores/UserStore.ts";

export const useSendMessage = () => {
	const stompClient = useStompClientStore((state) => state.stompClient);

	const sendMessage = ({ content, chatLogId, type = "CHAT" }: { content: string | null; chatLogId: number; type?: string }) => {
		if (stompClient?.connected) {
			const chatMessage = {
				messageLogId: chatLogId,
				senderId: UserStore.getLoggedInUser().id,
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
