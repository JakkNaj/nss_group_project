import {useEffect, useState} from "react";
import {useStompClientStore} from "../stores/StompClientStore.ts";
import {UserStore} from "../stores/UserStore.ts";


export const useSendLeave = () => {
    const [senderId, setSenderId] = useState<number>(-1);
    const stompClient = useStompClientStore((state) => state.stompClient);

    const user = UserStore.getLoggedInUser();

    useEffect(() => {
        if (user) {
            setSenderId(user.id);
        }
    }, []);

    if (senderId <= 0) {
        return { sendLeave: () => {} };
    }

    const sendLeave = ({ chatLogId, type = "LEAVE" }: { chatLogId: number; type?: string }) => {
        if (stompClient?.connected) {
            console.warn("Sending leave through websocket")
            const chatMessage = {
                messageLogId: chatLogId,
                senderId: senderId,
                type: type,
                timestampInSeconds: Math.floor(Date.now() / 1000),
            };

            console.log(chatMessage);

            stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
        }
    };

    return { sendLeave };
}