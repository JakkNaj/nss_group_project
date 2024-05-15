import { useStompClientStore } from "../stores/StompClientStore.ts";
import { UserStore } from "../stores/UserStore.ts";
import {MessageReferenceType} from "../model/types/MessageReference.ts";

export const useSendReply = () => {
    const stompClient = useStompClientStore((state) => state.stompClient);

    const sendReply = ({ content, chatLogId, type = "REPLY", messageReference }: { content: string | null; chatLogId: number; type?: string; messageReference : MessageReferenceType }) => {
        if (stompClient?.connected) {
            console.warn("Sending reply through websocket")
            const chatMessage = {
                messageLogId: chatLogId,
                senderId: UserStore.getLoggedInUser().id,
                content: content,
                type: type,
                timestampInSeconds: Math.floor(Date.now() / 1000),
                messageReference: messageReference
            };

            console.log(chatMessage);

            stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
        }
    };

    return { sendReply };
};
