import { useStompClientStore } from "../stores/StompClientStore.ts";
import { UserStore } from "../stores/UserStore.ts";
import {MessageReferenceType} from "../model/types/MessageReference.ts";
import {useEffect, useState} from "react";

export const useSendReply = () => {
    const [senderId, setSenderId] = useState<number>(-1);
    const stompClient = useStompClientStore((state) => state.stompClient);

    const user = UserStore.getLoggedInUser();

    useEffect(() => {
        if (user) {
            setSenderId(user.id);
        }
    }, []);

    if (senderId <= 0) {
        return { sendReply: () => {} };
    }

    const sendReply = ({ content, chatLogId, type = "REPLY", messageReference }: { content: string | null; chatLogId: number; type?: string; messageReference : MessageReferenceType }) => {
        if (stompClient?.connected) {
            console.warn("Sending reply through websocket")
            const chatMessage = {
                messageLogId: chatLogId,
                senderId: senderId,
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
