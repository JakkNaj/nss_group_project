import {useChatLogStore} from "../stores/ChatLogStore.ts";
import {useStompClientStore} from "../stores/StompClientStore.ts";
import {UserStore} from "../stores/UserStore.ts";

export const useSendMessage = () => {
    const stompClient = useStompClientStore((state) => state.stompClient);
    const { activeChatLog } = useChatLogStore((state) => ({
        activeChatLog: state.activeChatLog,
    }));

    const sendMessage = ({ content, chatId, type='CHAT' }: { content: string; chatId: number; type?: string }) => {
        if (!activeChatLog) {
            console.error('No active chat log, cannot send message!');
        }
        else if (content && chatId && stompClient?.connected) {
            const chatMessage = {
                messageLogId: activeChatLog.chatLogId,
                senderId: UserStore.getLoggedInUser().id,
                content: content,
                type: type,
                timestampInSeconds: Math.floor(Date.now() / 1000)
            };

            console.log(chatMessage);

            stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
        }
    };

    return { sendMessage };
};